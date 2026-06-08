import { useState } from "react";
import "../../style/SupportChat.css";

import { useSupport } from "../../hooks/chat/useSupport";
import { SupportSidebar } from "../../components/Chat/supportChat/SupportSidebar";
import { NewTicketModal } from "../../components/Chat/supportChat/NewTicketModal";
import { TicketHeader } from "../../components/Chat/supportChat/TicketHeader";
import { SupportMessageList } from "../../components/Chat/supportChat/SupportMessageList";
import { SupportInput } from "../../components/Chat/supportChat/SupportInput";

export default function Support() {
    const {
        tickets,
        currentTicket,
        messages,
        isLoading,
        isMsgLoading,
        wsConnected,
        wsError,
        currentUserId,
        selectTicket,
        handleSend,
        handleCreateTicket,
        handleCloseTicket,
    } = useSupport();

    const [showNewTicket, setShowNewTicket] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="app">
                <div className="empty-state">
                    <div className="empty-state-content">
                        <div className="loader" />
                        <p>Загрузка обращений...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app" style={{ gridTemplateRows: "1fr", height: "100vh" }}>
            {/* Overlay for mobile */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            <div className="layout">
                <SupportSidebar
                    tickets={tickets}
                    currentTicketId={currentTicket?.id ?? null}
                    showProfileMenu={showProfileMenu}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onNewTicket={() => setShowNewTicket(true)}
                    onSelectTicket={(t) => { selectTicket(t, currentUserId); setSidebarOpen(false); }}
                    onToggleProfileMenu={() => setShowProfileMenu((p) => !p)}
                    onOpenSettings={() => setShowSettings(true)}
                />

                <div className="chat">
                    {currentTicket ? (
                        <>
                            <TicketHeader
                                ticket={currentTicket}
                                wsConnected={wsConnected}
                                onClose={handleCloseTicket}
                                onOpenSidebar={() => setSidebarOpen(true)}
                            />
                            <SupportMessageList
                                messages={messages}
                                isMsgLoading={isMsgLoading}
                            />
                            <SupportInput
                                ticket={currentTicket}
                                wsConnected={wsConnected}
                                wsError={wsError}
                                onSend={handleSend}
                            />
                        </>
                    ) : (
                        <div className="empty" style={{ opacity: 1 }}>
                            {/* Burger button on empty state */}
                            <button
                                className="burger-btn"
                                style={{ position: 'absolute', top: '16px', left: '16px' }}
                                onClick={() => setSidebarOpen(true)}
                            >
                                <svg viewBox="0 0 24 24" strokeWidth="1.5" width="22" height="22">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                            <svg viewBox="0 0 24 24" strokeWidth="1.5" width="48" height="48" style={{ color: "var(--muted)" }}>
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                            </svg>
                            <h2 style={{ fontSize: "15px", color: "var(--text)" }}>Служба поддержки</h2>
                            <p style={{ fontSize: "13px", color: "var(--muted)", textAlign: "center" }}>
                                Создайте обращение, и наша команда поможет решить любой вопрос
                            </p>
                            <button
                                className="btn"
                                style={{ width: "auto", marginTop: "8px" }}
                                onClick={() => setShowNewTicket(true)}
                            >
                                + Новое обращение
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showNewTicket && (
                <NewTicketModal
                    onClose={() => setShowNewTicket(false)}
                    onCreate={async (title) => { await handleCreateTicket(title); }}
                />
            )}
        </div>
    );
}
