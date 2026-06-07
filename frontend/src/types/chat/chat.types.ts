export interface Message {
    id: number;
    text: string;
    time: string;
    isUser: boolean;
}

export interface ChatRoom {
    id: number;
    title: string;
    messages: Message[];
}
