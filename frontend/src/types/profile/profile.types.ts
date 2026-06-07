// profile.types.ts

export interface UserData {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'SUPPORT' | 'ADMIN';
    avatar?: string;
}

export interface SubscriptionData {
    status: string;   // "ACTIVE" | "BLOCKED" — строка с бэка
    endDate: string;  // уже отформатирована на бэке: "15 мая 2025г."
}

export interface RoleRequestData {
    id?: number;              // пока нет, но будет
    messageUser: string;
    answerAdmin?: string;
    statusRole: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    answeredAt?: string;
    user: UserDefaultResponse;
}

export interface UserDefaultResponse {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'SUPPORT' | 'ADMIN';
}