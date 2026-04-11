import { Router } from "express";
import { login, register, verifyEmail , getme ,resendVerificationEmail } from "../controllers/auth.controller.js";
import { loginValidation, registerValidation} from "../validators/auth.validators.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const authRouter = Router();
/** 
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
authRouter.post('/login', loginValidation, login);

/**
 * @route POST /api/auth/register
 * @desc Register new user and send email verification
 * @access Public
 */
authRouter.post('/register', registerValidation, register);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email using token
 * @access Public
 */
authRouter.get('/verify-email', verifyEmail);


/** * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get('/get-me', verifyToken, getme)

/**
 * @route POST /api/auth/resend-verification-email
 * @desc Resend email verification link to user
 * @access Public
 */
authRouter.post('/resend-verification-email', resendVerificationEmail);

export default authRouter;