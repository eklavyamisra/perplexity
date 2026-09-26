import { config, configDotenv } from "dotenv";
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

configDotenv();

const CLIENT_URL = process.env.CORS_ORIGIN || 'http://localhost:5173';

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({ 
            message: 'Username or email already exists',
            success: false,
            err: "Username or email already exists"
        });
    }

    const newUser = await userModel.create({ username, email, password });

    const emailVerificationToken = jwt.sign({ 
        email: newUser.email 
    }, process.env.JWT_SECRET);

    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}`;
    const emailSubject = 'Please verify your email for Perplexity';
    const emailText = `Hi ${username},\n\nThank you for registering at Perplexity! Please verify your email by clicking the link below:\n\n${verificationLink}\n\nIf you did not create an account, please ignore this email.\n\nBest regards,\nThe Perplexity Team`;
    const emailHtml = `<p>Hi ${username},</p><p>Thank you for registering at Perplexity! Please verify your email by clicking the link below:</p><p><a href="${verificationLink}">Verify Email</a></p><p>If you did not create an account, please ignore this email.</p><p>Best regards,<br>The Perplexity Team</p>`;

    // The account exists either way; a mail failure can be recovered with resend.
    let emailSent = true;
    try {
        await sendEmail({
            to: email,
            subject: emailSubject,
            text: emailText,
            html: emailHtml
        });
    } catch (error) {
        emailSent = false;
        console.error('Verification email failed:', error.message);
    }

    res.status(201).json({
        emailSent,
        message: 'User registered successfully. Please check your email to verify your account.',
        success: true,
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            isVerified: newUser.isVerified
        }
    });
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid token: user not found',
                success: false,
                err: "Invalid token: user not found"
            });
        }
        if (!user.verified) {
            user.verified = true;
            await user.save();
        }
        res.redirect(`${CLIENT_URL}/login?verified=1`);
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(400).json({ 
            message: 'Invalid or expired token',
            success: false,
            err: "Invalid or expired token"
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(400).json({
            message: 'Invalid email or password',
            success: false,
            err: "Invalid email or password"
        });
    }

    if (!user.verified) {
        return res.status(400).json({
            message: 'Email not verified. Please check your email for the verification link.',
            success: false,
            err: "Email not verified. Please check your email for the verification link."
        });
    }   

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({
            message: 'Invalid email or password',
            success: false,
            err: "Invalid email or password"
        });
    }
    
    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token, cookieOptions)

    res.json({
        message: 'Login successful',
        success: true,
        token,
        user: {
            id: user._id,   
            username: user.username,
            email: user.email,
            role: user.role,
            isVerified: user.verified
        }
    });
};

export const getme = async (req,res) => {
    const userId = req.userId

    const user = await userModel.findById(userId)

    if(!user){
        return res.status(404).json({
            message: "user not found",
            success: false,
            err: "user not found"
        })
    }

    res.status(200).json({
        message: "user details fetched successfully",
        success: true,
        user
    })

}

export const logout = (req, res) => {
    res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
    res.json({ message: 'Logged out', success: true });
};

export const resendVerificationEmail = async (req, res) => {
    const email = req.body.email;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: 'User not found',
            success: false,
            err: "User not found"
        });
    }

    if (user.verified) {
        return res.status(400).json({
            message: 'Email already verified',
            success: false,
            err: "Email already verified"
        });
    }

    // Generate a new verification token
    const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send the verification email
    const emailSubject = 'Verify your email';
    const emailText = `Please click the following link to verify your email: http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
    const emailHtml = `<p>Please click the following link to verify your email:</p><p><a href="http://localhost:3000/api/auth/verify-email?token=${verificationToken}">Verify Email</a></p>`;

    await sendEmail({
        to: user.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml
    });

    res.status(200).json({
        message: 'Verification email sent successfully',
        success: true
    });
};