import { UserDefaultResponse } from ".//support.types";

export interface ApiSupportMessageResponse {
    id: number;
    sender: UserDefaultResponse;
    senderType: "USER" | "SUPPORT" | "ADMIN";
    message: string;
    createdAt: string;
}
export interface ApiChatItem {
    id: number;
    title: string;
}

export interface ApiMessage {
    message: string;
    type: 'USER' | 'ASSISTANT';
}

export interface ApiChatDetail {
    id: number;
    title: string;
    message: ApiMessage[];
}
