import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, getMessages, fetchChats, deleteChat } from "../services/chat.api.js";
import {
    setChats,
    upsertChat,
    removeChat,
    appendMessages,
    setMessages,
    setCurrentChatId,
    setPending,
    setLoadingMessages,
    setError,
} from "../chat.slice.js";

const normalizeMessage = (msg) => ({
    id: msg._id,
    content: msg.content,
    sender: msg.role === 'user' ? 'user' : 'ai',
    sources: msg.sources || [],
    timestamp: msg.createdAt,
});

export const useChat = () => {
    const dispatch = useDispatch();
    const chats = useSelector(state => state.chat.chats);
    const currentChatId = useSelector(state => state.chat.currentChatId);
    const pending = useSelector(state => state.chat.pending);

    const loadChats = useCallback(async () => {
        try {
            const data = await fetchChats();
            dispatch(setChats(data.chats));
        } catch (error) {
            dispatch(setError(error.message));
        }
    }, [dispatch]);

    const openChat = useCallback(async (chatId) => {
        dispatch(setCurrentChatId(chatId));
        if (chats[chatId]?.messages) return;

        dispatch(setLoadingMessages(true));
        try {
            const data = await getMessages(chatId);
            dispatch(setMessages({ chatId, messages: data.messages.map(normalizeMessage) }));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoadingMessages(false));
        }
    }, [chats, dispatch]);

    const newChat = useCallback(() => {
        dispatch(setCurrentChatId(null));
    }, [dispatch]);

    // Resolves to true when the answer landed, so the composer knows whether to keep the text.
    const ask = useCallback(async (message) => {
        if (pending) return false;
        const chatId = currentChatId;

        dispatch(setError(null));
        dispatch(setPending({ chatId, content: message }));
        try {
            const data = await sendMessage({ chatId, message });
            const newMessages = [data.userMessage, data.aiMessage].map(normalizeMessage);

            if (chatId) {
                dispatch(appendMessages({ chatId, messages: newMessages }));
            } else {
                dispatch(upsertChat({ ...data.chat, messages: newMessages }));
                dispatch(setCurrentChatId(data.chat._id));
            }
            return true;
        } catch (error) {
            dispatch(setError(error.message));
            return false;
        } finally {
            dispatch(setPending(null));
        }
    }, [currentChatId, pending, dispatch]);

    const removeThread = useCallback(async (chatId) => {
        try {
            await deleteChat(chatId);
            dispatch(removeChat(chatId));
        } catch (error) {
            dispatch(setError(error.message));
        }
    }, [dispatch]);

    return { loadChats, openChat, newChat, ask, removeThread };
}
