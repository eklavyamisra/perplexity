import { initializeSocket } from "../services/chat.socket.js";
import { sendMessage, getMessages, fetchChats , deleteChat  } from "../services/chat.api.js";
import { useDispatch } from "react-redux";
import {setChats, setCurrentChatId, setLoading, setError, createNewChat,addNewMessage } from "../chat.slice.js";

export const useChat = () => {
    const dispatch = useDispatch();

    async function handleSendMessage({ chatId, message }) {
        dispatch(setLoading(true));
        const data = await sendMessage({ chatId, message });
        console.log("Data from sendMessage:", data);
        const { chat , aiMessage } = data;
        dispatch(createNewChat({ chatId: chat._id, title: chat.title }));
        dispatch(addNewMessage({ chatId: chat._id, message: { id: 'user-' + Date.now(), content: message, sender: 'user', timestamp: new Date() } }));
        dispatch(addNewMessage({ chatId: chat._id, message: { id: 'ai-' + Date.now(), content: aiMessage.content, sender: 'ai', timestamp: new Date() } }));
        dispatch(setCurrentChatId(chat._id));
    }
    const socket = initializeSocket();
    return { socket, handleSendMessage };
}