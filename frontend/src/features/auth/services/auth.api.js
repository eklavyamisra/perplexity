import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true,
});

// Surface the most useful message: validator errors come back as an array.
const toError = (error) => {
    const data = error.response?.data;
    const message = data?.errors?.[0]?.msg || data?.message || 'Network error — is the server running?';
    return new Error(message);
};

const request = async (fn) => {
    try {
        const response = await fn();
        return response.data;
    }
    catch (error) {
        throw toError(error);
    }
};

export const login = (email, password) => request(() => api.post('/login', { email, password }));

export const register = (username, email, password) => request(() => api.post('/register', { username, email, password }));

export const getme = () => request(() => api.get('/get-me'));

export const logout = () => request(() => api.post('/logout'));

export const resendVerification = (email) => request(() => api.post('/resend-verification-email', { email }));
