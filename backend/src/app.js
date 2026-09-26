import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import morgan from 'morgan';
import chatRouter from './routes/chat.routes.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const app = express();

app.use(morgan('dev'));

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(cookieParser());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);

// In production the built React app is served from here, so frontend and API share one origin.
const distPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // Any non-API route falls through to the SPA so react-router can handle it.
    app.get(/^\/(?!api\/).*/, (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// Express 5 forwards rejected async handlers here; always answer with JSON.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong',
        success: false,
    });
});

export default app;