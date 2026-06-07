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
        <div className="app">
            <SupportSidebar
                tickets={tickets}
                currentTicketId={currentTicket?.id ?? null}
                showProfileMenu={showProfileMenu}
                onNewTicket={() => setShowNewTicket(true)}
                onSelectTicket={(t) => selectTicket(t, currentUserId)}
                onToggleProfileMenu={() => setShowProfileMenu((p) => !p)}
            />

            <div className="main-content">
                {showNewTicket && (
                    <NewTicketModal
                        onClose={() => setShowNewTicket(false)}
                        onCreate={async (title) => {
                            await handleCreateTicket(title);
                        }}
                    />
                )}

                {currentTicket ? (
                    <div className="chat-page">
                        <TicketHeader
                            ticket={currentTicket}
                            wsConnected={wsConnected}
                            onClose={handleCloseTicket}
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
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-content">
                            <svg viewBox="0 0 24 24" strokeWidth="1.5" width="64" height="64">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                            </svg>
                            <h2>Служба поддержки</h2>
                            <p>Создайте обращение, и наша команда поможет решить любой вопрос</p>
                            <button className="start-chat-btn" onClick={() => setShowNewTicket(true)}>
                                <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                        d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Новое обращение
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
