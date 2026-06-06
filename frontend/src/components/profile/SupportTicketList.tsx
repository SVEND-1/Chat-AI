// src/components/profile/SupportTicketList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SupportTicketResponse } from '../../api/supportTicketApi';
import '../../style/profile/support-ticket-list.css';

interface SupportTicketListProps {
    tickets: SupportTicketResponse[];
}

const SupportTicketList: React.FC<SupportTicketListProps> = ({ tickets }) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const openTickets = tickets.filter(t => t.status === 'OPEN');

    return (
        <div className="profile-card support-ticket-list-card">
            <h2 className="card-title">
                Активные тикеты
                {openTickets.length > 0 && (
                    <span className="ticket-count-badge">{openTickets.length}</span>
                )}
            </h2>

            {openTickets.length === 0 ? (
                <div className="no-tickets">
                    <span className="no-tickets-icon">◌</span>
                    <p>Нет активных тикетов</p>
                </div>
            ) : (
                <div className="ticket-list">
                    {openTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="ticket-item"
                            onClick={() => navigate('/support-chat')}
                        >
                            <div className="ticket-item-header">
                                <span className="ticket-id">#{ticket.id}</span>
                                <span className="ticket-status-badge open">OPEN</span>
                            </div>
                            <div className="ticket-title">{ticket.title}</div>
                            <div className="ticket-meta">
                                <span className="ticket-user">
                                    👤 {ticket.user?.name ?? '—'}
                                </span>
                                <span className="ticket-date">
                                    {formatDate(ticket.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SupportTicketList;