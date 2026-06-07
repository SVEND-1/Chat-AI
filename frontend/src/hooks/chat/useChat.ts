import { useState, useEffect } from 'react';
import { ChatRoom, Message } from '../../types/chat/chat.types';
import { fetchChats, fetchChatMessages, createChat, deleteChat, sendMessage } from '../../api/chatApi';

export function useChat() {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [currentChatId, setCurrentChatId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const currentChat = chatRooms.find(chat => chat.id === currentChatId) ?? null;

    useEffect(() => {
        loadChats();
    }, []);

    useEffect(() => {
        if (currentChatId) {
            loadChatMessages(currentChatId);
        }
    }, [currentChatId]);

    const loadChats = async () => {
        setIsLoading(true);
        try {
            const chats = await fetchChats();
            setChatRooms(chats);
            if (chats.length > 0) setCurrentChatId(chats[0].id);
        } catch (error) {
            console.error('Ошибка загрузки чатов:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadChatMessages = async (chatId: number) => {
        try {
            const messages = await fetchChatMessages(chatId);
            setChatRooms(prev =>
                prev.map(chat => (chat.id === chatId ? { ...chat, messages } : chat))
            );
        } catch (error) {
            console.error('Ошибка загрузки сообщений:', error);
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim() || !currentChatId || isSending) return;

        const userMessage: Message = {
            id: Date.now(),
            text,
            time: new Date().toLocaleTimeString().slice(0, 5),
            isUser: true,
        };

        // Добавляем сообщение пользователя в конец массива (оно отображается последним = снизу)
        setChatRooms(prev =>
            prev.map(chat =>
                chat.id === currentChatId
                    ? { ...chat, messages: [...chat.messages, userMessage] }
                    : chat
            )
        );

        setIsSending(true);
        const assistantMessageId = Date.now() + 1;
        let assistantAdded = false;

        try {
            await sendMessage(currentChatId, text, chunk => {
                if (!assistantAdded) {
                    // Добавляем ответ ИИ после сообщения пользователя
                    setChatRooms(prev =>
                        prev.map(chat =>
                            chat.id === currentChatId
                                ? {
                                    ...chat,
                                    messages: [
                                        ...chat.messages,
                                        {
                                            id: assistantMessageId,
                                            text: chunk,
                                            time: new Date().toLocaleTimeString().slice(0, 5),
                                            isUser: false,
                                        },
                                    ],
                                }
                                : chat
                        )
                    );
                    assistantAdded = true;
                } else {
                    setChatRooms(prev =>
                        prev.map(chat =>
                            chat.id === currentChatId
                                ? {
                                    ...chat,
                                    messages: chat.messages.map(m =>
                                        m.id === assistantMessageId
                                            ? { ...m, text: m.text + chunk }
                                            : m
                                    ),
                                }
                                : chat
                        )
                    );
                }
            });
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
            setChatRooms(prev =>
                prev.map(chat =>
                    chat.id === currentChatId
                        ? {
                            ...chat,
                            messages: [
                                ...chat.messages,
                                {
                                    id: Date.now(),
                                    text: '❌ Ошибка при отправке сообщения. Попробуйте еще раз.',
                                    time: new Date().toLocaleTimeString().slice(0, 5),
                                    isUser: false,
                                },
                            ],
                        }
                        : chat
                )
            );
        } finally {
            setIsSending(false);
        }
    };

    const handleCreateChat = async () => {
        const title = `Новый чат ${chatRooms.length + 1}`;
        try {
            await createChat(title);
            await loadChats();
        } catch (error) {
            console.error('Ошибка создания чата:', error);
        }
    };

    const handleDeleteChat = async (chatId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteChat(chatId);
            setChatRooms(prev => prev.filter(chat => chat.id !== chatId));
            if (currentChatId === chatId) {
                const remaining = chatRooms.filter(chat => chat.id !== chatId);
                setCurrentChatId(remaining.length > 0 ? remaining[0].id : null);
            }
        } catch (error) {
            console.error('Ошибка удаления чата:', error);
        }
    };

    return {
        chatRooms,
        currentChat,
        currentChatId,
        isLoading,
        isSending,
        setCurrentChatId,
        handleSend,
        handleCreateChat,
        handleDeleteChat,
    };
}
