import { Server } from 'socket.io';

let io;

export const initSocketServer = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected');
    });

    console.log('Socket server initialized');
};

export const getSocketServer = () => {
    if (!io) {
        throw new Error('Socket server not initialized');
    }
    return io;
}
