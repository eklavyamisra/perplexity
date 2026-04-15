import { createSlice } from '@reduxjs/toolkit';

const chat = createSlice({
  name: 'chat',
  initialState: {
    chats: {},
    currentChatId: null,
    loading: false,
    error: null
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[chatId] = { 
                _id: chatId, 
                title,
                messages: [],
                createdAt: new Date().toISOString()  
            };
        },
        addNewMessage: (state, action) => {
            const { chatId, message } = action.payload;
            state.chats[chatId].messages.push(message);
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages;
            }
        },
    }
})

export const {setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, setMessages} = chat.actions;

export default chat.reducer;