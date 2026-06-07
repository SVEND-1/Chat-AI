import { SupportTicket, STATUS_LABELS } from "../../../types/chat/support.types";
import { formatDate } from "../../../utils/Chat/formatters";

interface TicketHeaderProps {
    ticket: SupportTicket;
    wsConnected: boolean;
    onClose: () => void;
}

export function TicketHeader({ ticket, wsConnected, onClose }: TicketHeaderProps) {
    return (
        <div className="chat-hdr">
            <div className="chat-hdr-info">
                <div className="chat-hdr-id">
                    Создан {formatDate(ticket.createdAt)}
                </div>
                <div className="chat-hdr-title">{ticket.title}</div>
            </div>

            <span className={`badge ${ticket.status === "OPEN" ? "open" : "closed"}`}>
                {STATUS_LABELS[ticket.status]}
            </span>

            <div className={`pill ${wsConnected ? "ok" : ""}`}>
                <span className="dot" />
                {wsConnected
                    ? "Подключено"
                    : ticket.support == null
                        ? "Ожидание оператора"
                        : "Нет соединения"}
            </div>

            {ticket.status !== "CLOSED" && (
                <button className="close-btn" onClick={onClose}>
                    Закрыть тикет
                </button>
            )}
        </div>
    );
}