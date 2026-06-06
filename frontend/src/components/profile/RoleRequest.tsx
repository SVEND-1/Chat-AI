// components/profile/RoleRequest.tsx
import React, { useState } from 'react';
import { RoleRequestData } from '../../types/profile/profile.types';

interface RoleRequestProps {
    existingRequest: RoleRequestData | null;
    onSubmit: (message: string) => Promise<void>;
}

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
    PENDING:  { text: 'На рассмотрении', className: 'status-pending' },
    APPROVED: { text: 'Принято',         className: 'status-approved' },
    REJECTED: { text: 'Отклонено',       className: 'status-rejected' },
};

const RoleRequest: React.FC<RoleRequestProps> = ({ existingRequest, onSubmit }) => {
    const [message, setMessage] = useState('');
    const [validationError, setValidationError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            setValidationError('Сообщение не может быть пустым');
            return;
        }
        if (message.trim().length < 10) {
            setValidationError('Сообщение слишком короткое (минимум 10 символов)');
            return;
        }

        try {
            setLoading(true);
            setSubmitError('');
            await onSubmit(message.trim());
            setMessage('');
        } catch {
            setSubmitError('Ошибка отправки заявки. Попробуйте ещё раз.');
        } finally {
            setLoading(false);
        }
    };

    // Если есть существующая заявка — показываем её статус
    if (existingRequest) {
        const statusInfo = STATUS_LABELS[existingRequest.statusRole] ?? {
            text: existingRequest.statusRole,
            className: 'status-pending',
        };

        return (
            <div className="profile-card role-request-card">
                <h2 className="card-title">Заявка на роль техподдержки</h2>
                <div className="request-info">
                    <div className="request-status">
                        Статус:{' '}
                        <span className={`status-badge ${statusInfo.className}`}>
                            {statusInfo.text}
                        </span>
                    </div>

                    <div className="request-message">
                        <span className="message-label">Ваше сообщение:</span>
                        <p>{existingRequest.messageUser}</p>
                    </div>

                    {existingRequest.createdAt && (
                        <div className="request-date">
                            Создано:{' '}
                            {new Date(existingRequest.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                    )}

                    {existingRequest.answerAdmin && (
                        <div className="admin-response">
                            <span className="message-label">Ответ администратора:</span>
                            <p>{existingRequest.answerAdmin}</p>
                            {existingRequest.answeredAt && (
                                <div className="request-date">
                                    {new Date(existingRequest.answeredAt).toLocaleDateString('ru-RU')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Форма создания заявки
    return (
        <div className="profile-card role-request-card">
            <h2 className="card-title">Заявка на роль техподдержки</h2>
            <form onSubmit={handleSubmit} className="request-form">
                <div className="form-group">
                    <label>Почему вас должны взять в техподдержку?</label>
                    <textarea
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            if (validationError) setValidationError('');
                        }}
                        placeholder="Например: 'У меня опыт работы с пользователями, знаю React...'"
                        rows={4}
                        maxLength={500}
                    />
                    <div className="message-counter">{message.length}/500</div>
                    {validationError && (
                        <div className="validation-error">{validationError}</div>
                    )}
                </div>

                {submitError && (
                    <div className="submit-error">{submitError}</div>
                )}

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? '⏳ Отправка...' : '🚀 Отправить заявку'}
                </button>
            </form>
        </div>
    );
};

export default RoleRequest;