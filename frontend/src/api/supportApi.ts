import axios from 'axios';
import { ApiSupportMessageResponse } from "../types/chat/api.types";
import { SupportMessage, SupportTicket, UserDefaultResponse } from "../types/chat/support.types";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

export const WS_BASE = "ws://localhost:8080/ws/support";

export function getTokenFromCookie(): string {
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
        const [key, val] = c.trim().split("=");
        if (key === "token" || key === "jwt" || key === "access_token") {
            return decodeURIComponent(val ?? "");
        }
    }
    return "";
}

export async function fetchCurrentUser(): Promise<UserDefaultResponse | null> {
    try {
        const response = await API.get<UserDefaultResponse>('/users/me');
        return response.data;
    } catch {
        return null;
    }
}

export async function fetchTickets(): Promise<SupportTicket[]> {
    const response = await API.get<SupportTicket[]>('/support-ticket');
    return response.data;
}

export async function createTicket(title: string): Promise<SupportTicket> {
    const response = await API.post<SupportTicket>('/support-ticket', { title });
    return response.data;
}

export async function closeTicketApi(id: number): Promise<SupportTicket> {
    const response = await API.patch<SupportTicket>(`/support-ticket/${id}`);
    return response.data;
}

export async function fetchMessages(ticketId: number): Promise<SupportMessage[]> {
    const response = await API.get<ApiSupportMessageResponse[]>(`/support-message/${ticketId}`);
    return response.data.map((m) => ({
        id: m.id,
        senderId: m.sender?.id ?? 0,
        senderEmail: m.sender?.email ?? "",
        senderType: m.senderType,
        message: m.message,
        createdAt: m.createdAt,
    }));
}