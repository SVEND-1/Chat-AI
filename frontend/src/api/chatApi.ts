import axios from 'axios';
import { ApiChatDetail, ApiChatItem } from '../types/chat/api.types';
import { ChatRoom, Message } from '../types/chat/chat.types';

// Создаем экземпляр axios для чатов (аналогично auth)
const API = axios.create({
    baseURL: "http://localhost:8080/api/chats",
    withCredentials: true,
});

export const parseSSEChunk = (chunk: string): string => {
    return chunk
        .split('\n')
        .filter(line => line.startsWith('data:'))
        .map(line => line.slice(5))
        .join('');
};

export const fetchChats = async (): Promise<ChatRoom[]> => {
    const response = await API.get<ApiChatItem[]>('');
    return response.data.map(chat => ({ id: chat.id, title: chat.title, messages: [] }));
};

export const fetchChatMessages = async (chatId: number): Promise<Message[]> => {
    const response = await API.get<ApiChatDetail>(`/${chatId}`);
    return response.data.message.map((msg, index) => ({
        id: chatId * 100000 + index,
        text: msg.message,
        time: new Date().toLocaleTimeString().slice(0, 5),
        isUser: msg.type === 'USER',
    }));
};

export const createChat = async (title: string): Promise<void> => {
    await API.post('', null, {
        params: { title: title }
    });
};

export const deleteChat = async (chatId: number): Promise<void> => {
    await API.delete(`/${chatId}`);
};

export const sendMessage = async (
    chatId: number,
    question: string,
    onChunk: (text: string) => void
): Promise<void> => {
    const response = await fetch(
        `http://localhost:8080/api/chats/${chatId}?question=${encodeURIComponent(question)}`,
        {
            method: 'POST',
            credentials: 'include',
            headers: { Accept: 'text/event-stream' },
        }
    );
    if (!response.ok) throw new Error('Ошибка отправки');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = parseSSEChunk(decoder.decode(value));
            if (text) onChunk(text);
        }
    }
};