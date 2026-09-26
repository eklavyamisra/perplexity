import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
})

const request = async (fn) => {
    try {
        const response = await fn();
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Network error — is the server running?');
    }
}

export const sendMessage = ({ chatId, message }) =>
    request(() => api.post(`/chats/messages`, { chat: chatId, message }));

export const fetchChats = () => request(() => api.get('/chats'));

export const getMessages = (chatId) => request(() => api.get(`/chats/${chatId}/messages`));

export const deleteChat = (chatId) => request(() => api.delete(`/chats/${chatId}`));
