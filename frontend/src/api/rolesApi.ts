// api/profile/rolesApi.ts
import axios from 'axios';
import { RoleRequestData } from '../../types/profile/profile.types';

const API_BASE_URL = 'http://localhost:8080';

const ROLES_API = axios.create({
    baseURL: `${API_BASE_URL}/api/roles`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

ROLES_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// GET /api/roles/user — все заявки текущего пользователя
export const getUserRoles = () => {
    return ROLES_API.get<RoleRequestData[]>('/user');
};

// POST /api/roles — создать заявку на роль
export const createRoleRequest = (message: string) => {
    return ROLES_API.post<string>('', { message });
};

export default ROLES_API;