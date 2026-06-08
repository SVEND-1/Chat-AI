import axios from "axios";

const API_BASE_URL = "";

const PAYMENT_API = axios.create({
    baseURL: `${API_BASE_URL}/api/payments`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

PAYMENT_API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface PaymentCreateResponse {
    paymentId: string;
    urlPay: string;
}

export interface PaymentResponse {
    id: string;
    value: string;
    description: string;
    status: string;
    createdAt: string;
}

export interface PaymentPageResponse {
    content: PaymentResponse[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

// POST /api/payments — создать платёж, получить ссылку на ЮКассу
export const createPayment = () => {
    return PAYMENT_API.post<PaymentCreateResponse>('');
};

// GET /api/payments?page=&size= — список платежей пользователя (нужен для polling)
export const getPayments = (page: number = 0, size: number = 10) => {
    return PAYMENT_API.get<PaymentPageResponse>('', { params: { page, size } });
};

// GET /api/payments/:paymentId — один платёж
export const getPaymentById = (paymentId: string) => {
    return PAYMENT_API.get<PaymentResponse>(`/${paymentId}`);
};

export interface ReceiptItem {
    description: string;
    quantity: string;
    amountValue: string;
    amountCurrency: string;
    vatCode: number;
}

export interface SettlementReceipt {
    type: string;
    amountValue: string;
    amountCurrency: string;
}

export interface ReceiptResponse {
    id: string;
    type: string;
    paymentId: string;
    status: string;
    amount: string;
    fiscalDocumentNumber: string;
    fiscalStorageNumber: string;
    fiscalAttribute: string;
    registeredAt: string;
    fiscalProviderId: string;
    items: ReceiptItem[];
    settlements: SettlementReceipt[];
    sellerName: string;
}

// GET /api/receipts/:paymentId
export const getReceipt = (paymentId: string) => {
    return axios.get<ReceiptResponse>(`${API_BASE_URL}/api/receipts/${paymentId}`, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
        }
    });
};

// POST /api/receipts/:paymentId
export const createReceipt = (paymentId: string) => {
    return axios.post<ReceiptResponse>(`${API_BASE_URL}/api/receipts/${paymentId}`, null, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
        }
    });
};

export default PAYMENT_API;
