import { createSlice } from '@reduxjs/toolkit';

const chat = createSlice({
    name: 'chat',
    initialState: {
        // Keyed by chat id; `messages` stays undefined until the thread is opened.
        chats: {},
        currentChatId: null,
        // The question in flight: { chatId, content } — chatId is null for a new thread.
        pending: null,
        loadingMessages: false,
        error: null,
    },
    reducers: {
        setChats: (state, action) => {
            const next = {};
            action.payload.forEach(c => {
                next[c._id] = { ...c, messages: state.chats[c._id]?.messages };
            });
            state.chats = next;
        },
        upsertChat: (state, action) => {
            const c = action.payload;
            state.chats[c._id] = { ...state.chats[c._id], ...c };
        },
        removeChat: (state, action) => {
            delete state.chats[action.payload];
            if (state.currentChatId === action.payload) state.currentChatId = null;
        },
        appendMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            const target = state.chats[chatId];
            if (!target) return;
            target.messages = [...(target.messages || []), ...messages];
            target.updatedAt = new Date().toISOString();
        },
        setMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages;
            }
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
            state.error = null;
        },
        setPending: (state, action) => {
            state.pending = action.payload;
        },
        setLoadingMessages: (state, action) => {
            state.loadingMessages = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    }
})

export const {
    setChats,
    upsertChat,
    removeChat,
    appendMessages,
    setMessages,
    setCurrentChatId,
    setPending,
    setLoadingMessages,
    setError,
} = chat.actions;

export default chat.reducer;
