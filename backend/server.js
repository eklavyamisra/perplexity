import dotenv from 'dotenv';
import connectdb from './src/config/database.js';
import app from './src/app.js';
import http from 'http';
import { initSocketServer } from './src/sockets/server.socket.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectdb();
        const server = http.createServer(app);
        initSocketServer(server);
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);

    }
};



startServer();
