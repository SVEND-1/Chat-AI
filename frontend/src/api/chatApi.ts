import { ApiChatDetail, ApiChatItem } from '../types/Chat/api.types';
import { ChatRoom, Message } from '../types/Chat/chat.types';

export const API_BASE_URL = 'http://localhost:8080/api/chats';

export const parseSSEChunk = (chunk: string): string => {
    return chunk
        .split('\n')
        .filter(line => line.startsWith('data:'))
        .map(line => line.slice(5))
        .join('');
};

export const fetchChats = async (): Promise<ChatRoom[]> => {
    const response = await fetch(API_BASE_URL, { credentials: 'include' });
    if (!response.ok) throw new Error('Ошибка загрузки чатов');
    const chats: ApiChatItem[] = await response.json();
    return chats.map(chat => ({ id: chat.id, title: chat.title, messages: [] }));
};

export const fetchChatMessages = async (chatId: number): Promise<Message[]> => {
    const response = await fetch(`${API_BASE_URL}/${chatId}`, { credentials: 'include' });
    if (!response.ok) throw new Error('Ошибка загрузки сообщений');
    const data: ApiChatDetail = await response.json();
    return data.message.map((msg, index) => ({
        id: chatId * 100000 + index,
        text: msg.message,
        time: new Date().toLocaleTimeString().slice(0, 5),
        isUser: msg.type === 'USER',
    }));
};

export const createChat = async (title: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}?title=${encodeURIComponent(title)}`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Ошибка создания чата');
};

export const deleteChat = async (chatId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${chatId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Ошибка удаления чата');
};

export const sendMessage = async (
    chatId: number,
    question: string,
    onChunk: (text: string) => void
): Promise<void> => {
    const response = await fetch(
        `${API_BASE_URL}/${chatId}?question=${encodeURIComponent(question)}`,
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
