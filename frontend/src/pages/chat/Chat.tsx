import { useState } from 'react';
import '../../style/chat.css';
import { useChat } from '../../hooks/chat/useChat';
import { Sidebar } from '../../components/Chat/Sidebar';
import { MessageList } from '../../components/Chat/MessageList';
import { MessageInput } from '../../components/Chat/MessageInput';
import { EmptyState } from '../../components/Chat/EmptyState';

export default function Chat() {
    const {
        chatRooms,
        currentChat,
        currentChatId,
        isLoading,
        isSending,
        setCurrentChatId,
        handleSend,
        handleCreateChat,
        handleDeleteChat,
    } = useChat();

    const [showProfileMenu, setShowProfileMenu] = useState(false);

    if (isLoading) {
        return (
            <div className="app">
                <div className="sidebar">
                    <div className="logo">
                        <span>Lumen</span>
                    </div>
                </div>
                <div className="main-content">
                    <div className="empty-state">
                        <div className="empty-state-content">
                            <div className="loader" />
                            <p>Загрузка чатов...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <Sidebar
                chatRooms={chatRooms}
                currentChatId={currentChatId}
                showProfileMenu={showProfileMenu}
                onCreateChat={handleCreateChat}
                onSelectChat={setCurrentChatId}
                onDeleteChat={handleDeleteChat}
                onToggleProfileMenu={() => setShowProfileMenu(prev => !prev)}
            />

            <div className="main-content">
                <div className="chat-page">
                    {currentChat ? (
                        <>
                            <div className="chat-header">
                                <h1>{currentChat.title}</h1>
                            </div>

                            <MessageList
                                messages={currentChat.messages}
                                isSending={isSending}
                            />

                            <MessageInput
                                isSending={isSending}
                                onSend={handleSend}
                            />
                        </>
                    ) : (
                        <EmptyState onCreateChat={handleCreateChat} />
                    )}
                </div>
            </div>
        </div>
    );
}
