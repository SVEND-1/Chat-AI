import { Link } from "react-router-dom";
import logoIcon from "../../../assets/icons/icon.svg";
import { SupportTicket, STATUS_LABELS } from "../../../types/chat/support.types";

interface SupportSidebarProps {
    tickets: SupportTicket[];
    currentTicketId: number | null;
    showProfileMenu: boolean;
    onNewTicket: () => void;
    onSelectTicket: (ticket: SupportTicket) => void;
    onToggleProfileMenu: () => void;
}

export function SupportSidebar({
    tickets,
    currentTicketId,
    showProfileMenu,
    onNewTicket,
    onSelectTicket,
    onToggleProfileMenu,
}: SupportSidebarProps) {
    return (
        <div className="sidebar">
            <div className="logo">
                <img src={logoIcon} alt="Lumen logo" className="logo-icon" />
                <span>Lumen</span>
            </div>

            <button className="create-chat-btn" onClick={onNewTicket}>
                <svg viewBox="0 0 24 24" strokeWidth="1.5">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Новый тикет</span>
            </button>

            {tickets.length > 0 && (
                <div className="chat-list">
                    <h3 className="chat-list-title">Мои обращения</h3>
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="chat-item-wrapper">
                            <button
                                className={`chat-item support-ticket-item ${ticket.id === currentTicketId ? "active" : ""}`}
                                onClick={() => onSelectTicket(ticket)}
                            >
                                <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                        d="M16.5 6v.75a3.75 3.75 0 0 1-7.5 0V6m-1.5 0h10.5m-10.5 0H4.5m15 0H19.5M7.5 6H16.5M3 18l1.5-9h15L21 18H3Z" />
                                </svg>
                                <div className="ticket-info">
                                    <span className="chat-name">{ticket.title}</span>
                                    <span className={`ticket-status-badge status-${ticket.status.toLowerCase()}`}>
                                        {STATUS_LABELS[ticket.status]}
                                    </span>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="sidebar-footer">
                <Link to="/chat" className="subscribe-btn" style={{ textDecoration: "none" }}>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM12 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM21 12c0 4.556-4.03 8.25-9 8.25a9.9 9.9 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a52.497 52.497 0 0 0-.106-.384c-.27-.99-.353-1.63-.353-1.63C3.622 18.073 3 15.136 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    <span>AI Чат</span>
                </Link>

                <div className="profile-section">
                    <button className="profile-btn" onClick={onToggleProfileMenu}>
                        <div className="profile-avatar">
                            <svg viewBox="0 0 24 24" strokeWidth="1.5">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <span>Профиль</span>
                    </button>

                    {showProfileMenu && (
                        <div className="profile-menu">
                            <Link to="/settings" className="profile-menu-item">
                                <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.074-.04.147-.083.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                Настройки
                            </Link>
                            <button className="profile-menu-item logout">
                                <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                                Выйти
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
