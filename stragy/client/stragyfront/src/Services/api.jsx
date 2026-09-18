import axios from 'axios';

export const TOKEN_KEY = 'stragy_token';
export const USER_KEY = 'stragy_user';

const configuredApiUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL;
const apiBaseUrl = (configuredApiUrl || 'http://app.onrender.com').replace(/\/$/, ''); // Remove trailing slash if present

const api = axios.create({
    baseURL:apiBaseUrl,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(stragy_token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;