export interface UserData {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'support' | 'admin';
    avatar?: string;
    createdAt: string;
}

export interface SubscriptionData {
    status: 'active' | 'inactive' | 'expired' | 'pending';
    plan?: 'basic' | 'premium' | 'pro';
    startDate?: string;
    endDate?: string;
    autoRenew: boolean;
}

export interface RoleRequestData {
    id: string;
    userId: string;
    requestedRole: 'support';
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
    createdAt: string;
    reviewedAt?: string;
}

export interface PaymentHistoryItem {
    id: string;
    date: string;
    amount: number;
    currency: string;
    status: 'success' | 'pending' | 'failed';
    description: string;
    invoiceUrl?: string;
}