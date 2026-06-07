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
