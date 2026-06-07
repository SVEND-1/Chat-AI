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

    // Отладка
    console.log('🔴 Chat render:', {
        chatRoomsLength: chatRooms.length,
        currentChatId,
        hasSidebar: !!chatRooms
    });

    if (isLoading) {
        return (
            <div className="app">
                <div style={{ width: '280px', background: '#1a1a1a' }}>Загрузка...</div>
                <div className="main-content">
                    <div className="empty-state">Загрузка чатов...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar - принудительно показываем */}
            <div style={{ width: '280px', flexShrink: 0 }}>
                <Sidebar
                    chatRooms={chatRooms}
                    currentChatId={currentChatId}
                    showProfileMenu={showProfileMenu}
                    onCreateChat={handleCreateChat}
                    onSelectChat={setCurrentChatId}
                    onDeleteChat={handleDeleteChat}
                    onToggleProfileMenu={() => setShowProfileMenu(prev => !prev)}
                />
            </div>

            {/* Main content */}
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="chat-page" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {currentChat ? (
                        <>
                            <div className="chat-header" style={{ padding: '20px', borderBottom: '1px solid #333' }}>
                                <h1 style={{ color: 'white', margin: 0 }}>{currentChat.title}</h1>
                            </div>

                            <div style={{ flex: 1, overflow: 'auto' }}>
                                <MessageList messages={currentChat.messages} isSending={isSending} />
                            </div>

                            <div style={{ padding: '20px' }}>
                                <MessageInput isSending={isSending} onSend={handleSend} />
                            </div>
                        </>
                    ) : (
                        <EmptyState onCreateChat={handleCreateChat} />
                    )}
                </div>
            </div>
        </div>
    );
}