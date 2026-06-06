// src/components/profile/SupportTicketList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupportTicketResponse } from '../../api/supportTicketApi';
import '../../style/profile/support-ticket-list.css';

interface SupportTicketListProps {
    tickets: SupportTicketResponse[];
}

const SupportTicketList: React.FC<SupportTicketListProps> = ({ tickets }) => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'OPEN' | 'CLOSED'>('OPEN');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const filteredTickets = tickets.filter(t => t.status === filter);
    const openCount = tickets.filter(t => t.status === 'OPEN').length;
    const closedCount = tickets.filter(t => t.status === 'CLOSED').length;

    return (
        <div className="profile-card support-ticket-list-card">
            <h2 className="card-title">Тикеты</h2>

            <div className="ticket-filter-buttons">
                <button
                    className={`ticket-filter-btn ${filter === 'OPEN' ? 'active' : ''}`}
                    onClick={() => setFilter('OPEN')}
                >
                    Открытые
                    {openCount > 0 && (
                        <span className="ticket-count-badge">{openCount}</span>
                    )}
                </button>
                <button
                    className={`ticket-filter-btn ${filter === 'CLOSED' ? 'active' : ''}`}
                    onClick={() => setFilter('CLOSED')}
                >
                    Закрытые
                    {closedCount > 0 && (
                        <span className="ticket-count-badge closed">{closedCount}</span>
                    )}
                </button>
            </div>

            {filteredTickets.length === 0 ? (
                <div className="no-tickets">
                    <span className="no-tickets-icon">◌</span>
                    <p>{filter === 'OPEN' ? 'Нет открытых тикетов' : 'Нет закрытых тикетов'}</p>
                </div>
            ) : (
                <div className="ticket-list">
                    {filteredTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="ticket-item"
                            onClick={() => navigate('/supportChat')}
                        >
                            <div className="ticket-item-header">
                                <span className="ticket-id">#{ticket.id}</span>
                                <span className={`ticket-status-badge ${ticket.status === 'OPEN' ? 'open' : 'closed'}`}>
                                    {ticket.status === 'OPEN' ? 'OPEN' : 'CLOSED'}
                                </span>
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