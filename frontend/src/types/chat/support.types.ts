export interface UserDefaultResponse {
    id: number;
    email: string;
}

export interface SupportTicket {
    id: number;
    user: UserDefaultResponse;
    support: UserDefaultResponse | null;
    title: string;
    status: "OPEN" | "IN_PROGRESS" | "CLOSED";
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
}

export interface SupportMessage {
    id: number;
    senderId: number;
    senderEmail: string;
    senderType: "USER" | "SUPPORT" | "ADMIN";
    message: string;
    createdAt: string;
}

export const STATUS_LABELS: Record<string, string> = {
    OPEN: "Открыт",
    IN_PROGRESS: "В работе",
    CLOSED: "Закрыт",
};
