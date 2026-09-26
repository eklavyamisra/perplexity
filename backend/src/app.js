import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import morgan from 'morgan';
import chatRouter from './routes/chat.routes.js';


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
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);

// Express 5 forwards rejected async handlers here; always answer with JSON.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong',
        success: false,
    });
});

export default app;