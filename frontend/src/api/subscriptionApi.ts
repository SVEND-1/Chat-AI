import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const SUBSCRIPTION_API = axios.create({
    baseURL: `${API_BASE_URL}/api/subscription`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

SUBSCRIPTION_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface SubscriptionDetailResponse {
    status: string;  // "ACTIVE" | "BLOCKED"
    endDate: string; // уже отформатирована на бэке: "15 мая 2025г."
}

// POST /api/subscription/:paymentId — активировать/продлить подписку
export const createSubscription = (paymentId: string) => {
    return SUBSCRIPTION_API.post<string>(`/${paymentId}`);
};

// GET /api/subscription/:id — получить подписку по id
export const getSubscription = (id: number) => {
    return SUBSCRIPTION_API.get<SubscriptionDetailResponse>(`/${id}`);
};

export default SUBSCRIPTION_API;
