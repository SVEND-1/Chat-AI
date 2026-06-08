import { useState } from 'react';
import '../../style/chat.css';
import { useChat } from '../../hooks/chat/useChat';
import { Sidebar } from '../../components/Chat/Sidebar';
import { MessageList } from '../../components/Chat/MessageList';
import { MessageInput } from '../../components/Chat/MessageInput';
import { EmptyState } from '../../components/Chat/EmptyState';
import SettingsModal from "../../components/Chat/settingModal/SettingModal";

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
    const [showSettings, setShowSettings] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            {/* Overlay for mobile */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            <div style={{ width: '280px', flexShrink: 0 }}>
                <Sidebar
                    chatRooms={chatRooms}
                    currentChatId={currentChatId}
                    showProfileMenu={showProfileMenu}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onCreateChat={handleCreateChat}
                    onSelectChat={(id) => { setCurrentChatId(id); setSidebarOpen(false); }}
                    onDeleteChat={handleDeleteChat}
                    onToggleProfileMenu={() => setShowProfileMenu(prev => !prev)}
                    onOpenSettings={() => setShowSettings(true)}
                />
            </div>

            {/* Main content */}
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="chat-page" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {currentChat ? (
                        <>
                            <div className="chat-header" style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {/* Burger button */}
                                <button className="burger-btn" onClick={() => setSidebarOpen(true)}>
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="22" height="22">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                </button>
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
                        <>
                            {/* Burger button on empty state too */}
                            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                                <button className="burger-btn" onClick={() => setSidebarOpen(true)}>
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="22" height="22">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                </button>
                            </div>
                            <EmptyState onCreateChat={handleCreateChat} />
                        </>
                    )}
                </div>
            </div>

            {showSettings && (
                <SettingsModal onClose={() => setShowSettings(false)} />
            )}
        </div>
    );
}
