import { io } from "socket.io-client";

let socket = null;

// One shared connection for the whole app, created lazily on first use.
export const initializeSocket = () => {
    if (socket) return socket;

    socket = io('http://localhost:3000', {
        withCredentials: true,
    });
    socket.on('connect', () => {
        console.log('Connected to socket server');
    });
    socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
    });
    return socket;
}
