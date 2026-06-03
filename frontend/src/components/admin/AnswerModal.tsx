import React from 'react';
import type { RoleResponse, StatusRole } from '../../api/adminApi';
import '../../style/admin/AnswerModal.css';

interface Props {
    application: RoleResponse;
    answerText: string;
    loading: boolean;
    onTextChange: (v: string) => void;
    onSubmit: (status: StatusRole) => void;
    onClose: () => void;
}

const AnswerModal: React.FC<Props> = ({ application, answerText, loading, onTextChange, onSubmit, onClose }) => (
    <div className="answer-modal-overlay" onClick={onClose}>
        <div className="answer-modal" onClick={e => e.stopPropagation()}>
            <div className="answer-modal__header">
                <h2 className="answer-modal__title">Ответ на заявку</h2>
                <button className="answer-modal__close" onClick={onClose}>×</button>
            </div>

            <div className="answer-modal__info">
                <span className="answer-modal__label">От пользователя:</span>
                <span className="answer-modal__value">{application.user?.email}</span>
            </div>
            <div className="answer-modal__info">
                <span className="answer-modal__label">Сообщение:</span>
                <p className="answer-modal__message">"{application.messageUser}"</p>
            </div>

            <textarea
                className="answer-modal__textarea"
                placeholder="Введите ответ (необязательно)..."
                value={answerText}
                onChange={e => onTextChange(e.target.value)}
                rows={3}
            />

            <div className="answer-modal__actions">
                <button
                    className="answer-modal__btn answer-modal__btn--approve"
                    onClick={() => onSubmit('APPROVED')}
                    disabled={loading}
                >
                    {loading ? '...' : '✓ Одобрить'}
                </button>
                <button
                    className="answer-modal__btn answer-modal__btn--reject"
                    onClick={() => onSubmit('REJECTED')}
                    disabled={loading}
                >
                    {loading ? '...' : '✗ Отклонить'}
                </button>
            </div>
        </div>
    </div>
);

export default AnswerModal;
