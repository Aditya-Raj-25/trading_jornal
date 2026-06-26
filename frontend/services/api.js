import axios from 'axios';
import { storage } from '../utils/storage';

const API_URL = 'http://192.168.128.18:5001/api'; // Updated for physical device access

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    async (config) => {
        const token = await storage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    checkEmail: (email) => api.get(`/auth/check-email?email=${encodeURIComponent(email)}`),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const tradeService = {
    createTrade: (tradeData) => api.post('/trades', tradeData),
    getTrades: () => api.get('/trades'),
    getTradeById: (id) => api.get(`/trades/${id}`),
    updateTrade: (id, tradeData) => api.put(`/trades/${id}`, tradeData),
    deleteTrade: (id) => api.delete(`/trades/${id}`),
};

export const analyticsService = {
    getSummary: () => api.get('/analytics/summary'),
    getInsights: () => api.get('/analytics/insights'),
};

export const planService = {
    getPlan: () => api.get('/plan'),
    savePlan: (planData) => api.post('/plan', planData),
};

export default api;
