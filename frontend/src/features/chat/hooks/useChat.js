import { initializeSocket } from "../services/chat.socket.js";

export const useChat = () => {
    const socket = initializeSocket();
    return { socket };
}