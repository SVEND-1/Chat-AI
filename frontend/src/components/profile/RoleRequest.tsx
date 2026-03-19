import React, { useState } from 'react';

const RoleRequest = () => {
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);

        // Имитация запроса на сервер (2 секунды)
        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
        }, 2000);
    };

    if (submitted) {
        return (
            <div className="profile-card role-request-card">
                <h2 className="card-title">Заявка на роль техподдержки</h2>
                <div className="request-info">
                    <div className="request-status">
                        Статус: <span className="status-badge status-pending">На рассмотрении</span>
                    </div>

                    <div className="request-message">
                        <span className="message-label">Ваше сообщение:</span>
                        <p>{message}</p>
                    </div>

                    <div className="request-date">
                        Создано: {new Date().toLocaleDateString('ru-RU')}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-card role-request-card">
            <h2 className="card-title">Заявка на роль техподдержки</h2>
            <form onSubmit={handleSubmit} className="request-form">
                <div className="form-group">
                    <label>Почему вас должны взять в техподдержку?</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Например: 'У меня опыт работы с пользователями, знаю React...'"
                        rows={4}
                        maxLength={500}
                        required
                    />
                    <div className="message-counter">{message.length}/500</div>
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? '⏳ Отправка...' : '🚀 Отправить заявку'}
                </button>
            </form>
        </div>
    );
};

export default RoleRequest;
