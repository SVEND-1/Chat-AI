// src/api/supportTicketApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const SUPPORT_TICKET_API = axios.create({
    baseURL: `${API_BASE_URL}/api/support-ticket`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

SUPPORT_TICKET_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface SupportTicketResponse {
    id: number;
    user: { id: number; name: string; email: string; role: string };
    support: { id: number; name: string; email: string; role: string } | null;
    title: string;
    status: 'OPEN' | 'CLOSED';
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
}

// GET /api/support-ticket/support — тикеты назначенные на текущего саппорта
export const getSupportTickets = () => {
    return SUPPORT_TICKET_API.get<SupportTicketResponse[]>('/support');
};

export default SUPPORT_TICKET_API;