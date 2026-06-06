import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const ADMIN_API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

ADMIN_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type Role = 'USER' | 'SUPPORT' | 'ADMIN';
export type StatusRole = 'WAITING' | 'APPROVED' | 'REJECTED';

export interface UserDefaultResponse {
    id: number;
    email: string;
    username: string;
    role: Role;
}

export interface UsersAmountResponse {
    usersAmount: number;
}

export interface SubscriptionsPercentResponse {
    subscriptionsPercent: number;
}

export interface RoleResponse {
    id: number;
    messageUser: string;
    answerAdmin: string | null;
    statusRole: StatusRole;
    createdAt: string;
    answeredAt: string | null;
    user: UserDefaultResponse;
}

export interface AdminAnswerRequest {
    answerAdmin: string;
    statusRole: StatusRole;
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

// GET /api/admin-stats/users?pageSize=&pageNumber=&role=
export const getUsers = (pageSize: number, pageNumber: number, role?: Role) =>
    ADMIN_API.get<UserDefaultResponse[]>('/api/admin-stats/users', {
        params: { pageSize, pageNumber, ...(role ? { role } : {}) },
    });

// GET /api/admin-stats/users-amount?role=
export const getUsersAmount = (role?: Role) =>
    ADMIN_API.get<UsersAmountResponse>('/api/admin-stats/users-amount', {
        params: role ? { role } : {},
    });

// GET /api/admin-stats/subscriptions
export const getSubscriptionsPercent = () =>
    ADMIN_API.get<SubscriptionsPercentResponse>('/api/admin-stats/subscriptions');

// GET /api/admin-stats/support?email=
export const getSupportByEmail = (email: string) =>
    ADMIN_API.get<UserDefaultResponse>('/api/admin-stats/support', { params: { email } });

// POST /api/admin-stats/{email}/subscriptions — выдать подписку по email
export const giveSubscription = (email: string) =>
    ADMIN_API.post<string>(`/api/admin-stats/${encodeURIComponent(email)}/subscriptions`);

// ─── Role Applications ────────────────────────────────────────────────────────

// GET /api/roles?page-size=&page-number=&status-role=
export const getRoleApplications = (pageSize: number, pageNumber: number, statusRole?: StatusRole) =>
    ADMIN_API.get<RoleResponse[]>('/api/roles', {
        params: {
            'page-size': pageSize,
            'page-number': pageNumber,
            ...(statusRole ? { 'status-role': statusRole } : {}),
        },
    });

// POST /api/roles/{id} — одобрить/отклонить заявку
export const answerRoleApplication = (id: number, data: AdminAnswerRequest) =>
    ADMIN_API.post<RoleResponse>(`/api/roles/${id}`, data);
