import React, { useState } from 'react';
import { RoleRequestData } from '../../types/profile/profile.types';

interface RoleRequestProps {
    existingRequest: RoleRequestData | null;
    onSubmit: (message: string) => void;
    userRole: string;
}

const RoleRequest: React.FC<RoleRequestProps> = ({ existingRequest, onSubmit, userRole }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSubmit(message);
            setIsFormOpen(false);
            setMessage('');
        }
    };

    const getStatusBadge = (status: string) => {
        const statuses = {
            pending: { text: 'На рассмотрении', className: 'status-pending' },
            approved: { text: 'Одобрено', className: 'status-approved' },
            rejected: { text: 'Отклонено', className: 'status-rejected' }
        };
        const statusInfo = statuses[status as keyof typeof statuses];
        return <span className={`status-badge ${statusInfo.className}`}>{statusInfo.text}</span>;
    };

    if (userRole === 'support') {
        return (
            <div className="profile-card role-request-card">
                <h2 className="card-title">Роль в системе</h2>
                <div className="role-info">
                    <p>Вы уже являетесь сотрудником техподдержки</p>
                    <span className="role-badge role-support">Техподдержка</span>
                </div>
            </div>
        );
    }

    if (existingRequest) {
        return (
            <div className="profile-card role-request-card">
                <h2 className="card-title">Заявка на роль техподдержки</h2>
                <div className="request-info">
                    <div className="request-status">
                        Статус: {getStatusBadge(existingRequest.status)}
                    </div>
                    {existingRequest.message && (
                        <div className="request-message">
                            <span className="message-label">Ваше сообщение:</span>
                            <p>{existingRequest.message}</p>
                        </div>
                    )}
                    <div className="request-date">
                        Отправлено: {new Date(existingRequest.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-card role-request-card">
            <h2 className="card-title">Стать частью техподдержки</h2>

            {!isFormOpen ? (
                <div className="request-preview">
                    <p>Хотите помогать другим пользователям? Подайте заявку на роль сотрудника техподдержки.</p>
                    <button
                        className="request-button"
                        onClick={() => setIsFormOpen(true)}
                    >
                        Подать заявку
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-group">
                        <label htmlFor="request-message">Почему вы хотите стать частью техподдержки?</label>
                        <textarea
                            id="request-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Расскажите о своем опыте и мотивации..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-button">
                            Отправить заявку
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setIsFormOpen(false)}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RoleRequest;