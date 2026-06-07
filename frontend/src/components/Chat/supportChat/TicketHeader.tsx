import { SupportTicket, STATUS_LABELS } from "../../../types/chat/support.types";
import { formatDate } from "../../../utils/Chat/formatters";

interface TicketHeaderProps {
    ticket: SupportTicket;
    wsConnected: boolean;
    onClose: () => void;
}

export function TicketHeader({ ticket, wsConnected, onClose }: TicketHeaderProps) {
    return (
        <div className="chat-header support-chat-header">
            <div className="support-header-left">
                <h1>{ticket.title}</h1>
                <div className="support-header-meta">
                    <span className={`ticket-status-badge status-${ticket.status.toLowerCase()}`}>
                        {STATUS_LABELS[ticket.status]}
                    </span>
                    <span className="support-header-date">
                        Создан {formatDate(ticket.createdAt)}
                    </span>
                    <span className={`ws-indicator ${wsConnected ? "connected" : "disconnected"}`}>
                        <span className="ws-dot" />
                        {wsConnected
                            ? "Подключено"
                            : ticket.support == null
                                ? "Ожидание оператора"
                                : "Нет соединения"}
                    </span>
                </div>
            </div>
            {ticket.status !== "CLOSED" && (
                <button className="close-ticket-btn" onClick={onClose}>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Закрыть тикет
                </button>
            )}
        </div>
    );
}
