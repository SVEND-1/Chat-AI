import React, { useState } from 'react';
import type { RoleResponse, StatusRole } from '../../api/adminApi';
import { answerRoleApplication } from '../../api/adminApi';
import AdminPagination from './AdminPagination';
import '../../style/admin/ApplicationsTab.css';

const STATUSES: StatusRole[] = ['WAITING', 'APPROVED', 'REJECTED'];
const STATUS_LABELS: Record<StatusRole, string> = {
    WAITING: 'На рассмотрении',
    APPROVED: 'Одобрено',
    REJECTED: 'Отклонено',
};

interface Props {
    applications: RoleResponse[];
    page: number;
    totalPages: number;
    statusFilter: StatusRole | undefined;
    loading: boolean;
    onPageChange: (p: number) => void;
    onStatusFilter: (s: StatusRole | undefined) => void;
    onAnswer: (app: RoleResponse) => void; // оставляем для совместимости
    onRefresh: () => void;
}

interface CardProps {
    app: RoleResponse;
    onRefresh: () => void;
}

const AppCard: React.FC<CardProps> = ({ app, onRefresh }) => {
    const [answerText, setAnswerText] = useState('');
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState('');
    const [done, setDone] = useState(false);

    const submit = async (statusRole: StatusRole) => {
        setLoading(true);
        setError('');
        try {
            await answerRoleApplication(app.id, { answerAdmin: answerText, statusRole });
            setDone(true); // скрываем кнопки сразу
            onRefresh();
        } catch (e: any) {
            setError(e.response?.data?.message ?? 'Ошибка при отправке');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-card">
            <div className="app-card__top">
                <div className="app-card__user">
                    <span className="app-card__email">{app.user?.email ?? '—'}</span>
                    <span className="app-card__username">{app.user?.username ?? ''}</span>
                </div>
                <span className={`app-card__status app-card__status--${app.statusRole.toLowerCase()}`}>
                    {STATUS_LABELS[app.statusRole]}
                </span>
            </div>

            <p className="app-card__message">"{app.messageUser}"</p>

            {app.answerAdmin && (
                <p className="app-card__answer">Ответ администратора: {app.answerAdmin}</p>
            )}

            <div className="app-card__footer">
                <span className="app-card__date">
                    {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                </span>
            </div>

            {app.statusRole === 'WAITING' && !done && (
                <div className="app-card__actions">
                    <textarea
                        className="app-card__textarea"
                        placeholder="Комментарий (необязательно)..."
                        value={answerText}
                        onChange={e => setAnswerText(e.target.value)}
                        rows={2}
                        disabled={loading}
                    />
                    {error && <p className="app-card__error">{error}</p>}
                    <div className="app-card__btns">
                        <button
                            className="app-card__btn app-card__btn--approve"
                            onClick={() => submit('APPROVED')}
                            disabled={loading}
                        >
                            {loading ? '...' : '✓ Одобрить'}
                        </button>
                        <button
                            className="app-card__btn app-card__btn--reject"
                            onClick={() => submit('REJECTED')}
                            disabled={loading}
                        >
                            {loading ? '...' : '✗ Отклонить'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ApplicationsTab: React.FC<Props> = ({
    applications, page, totalPages, statusFilter, loading,
    onPageChange, onStatusFilter, onRefresh
}) => (
    <div className="apps-tab">
        <div className="admin-filters">
            <button
                className={`admin-filter-btn ${!statusFilter ? 'admin-filter-btn--active' : ''}`}
                onClick={() => onStatusFilter(undefined)}
            >
                Все
            </button>
            {STATUSES.map(s => (
                <button
                    key={s}
                    className={`admin-filter-btn ${statusFilter === s ? 'admin-filter-btn--active' : ''}`}
                    onClick={() => onStatusFilter(s)}
                >
                    {STATUS_LABELS[s]}
                </button>
            ))}
        </div>

        {loading ? (
            <div className="admin-loading"><div className="ph-spinner" />Загрузка...</div>
        ) : applications.length === 0 ? (
            <div className="admin-empty">Заявок не найдено</div>
        ) : (
            <div className="apps-list">
                {applications.map((app, i) => (
                    <AppCard key={app.id ?? i} app={app} onRefresh={onRefresh} />
                ))}
            </div>
        )}

        <AdminPagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </div>
);

export default ApplicationsTab;
