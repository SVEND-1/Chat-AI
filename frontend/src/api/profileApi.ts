// api/profile/profileApi.ts
import axios from 'axios';
import { UserData } from '../types/profile/profile.types';

const API_BASE_URL = 'http://localhost:8080';

const PROFILE_API = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

PROFILE_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// GET /api/users/me — получить текущего пользователя
export const getCurrentUser = () => {
    return PROFILE_API.get<UserData>('/users/me');
};

export default PROFILE_API;