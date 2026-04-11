import nodemailer from 'nodemailer';

import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN,
    },
});

transporter.verify()
    .then(() => {
        console.log('Email transporter is ready');
    })
    .catch((error) => {
        console.error('Error setting up email transporter:', error.message);
    });

export const sendEmail = async (options) => {
    const { to, subject, html, text } = options;
    
    if (!to) {
        throw new Error('Recipient email address (to) is required');
    }
    
    const mailOptions = {
        from: process.env.GOOGLE_USER_EMAIL,
        to,
        subject,
        html,
        text,
    };

    const details = await transporter.sendMail(mailOptions);
    console.log('Email sent:', details);
}