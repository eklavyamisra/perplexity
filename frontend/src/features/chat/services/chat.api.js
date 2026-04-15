import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
})

export const sendMessage = async ({ chatId, message }) => {
    const response = await api.post(`/chats/messages`, { chat: chatId, message });
    console.log("Response from sendMessage API:", response.data);
    return response.data;
}

export const fetchChats = async () => {
    const response = await api.get('/chats');
    return response.data;
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/chats/${chatId}`);
    return response.data;
}

