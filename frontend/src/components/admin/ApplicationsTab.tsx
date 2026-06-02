import React from 'react';
import type { RoleResponse, StatusRole } from '../../api/adminApi';
import AdminPagination from './AdminPagination';
import '../../style/admin/ApplicationsTab.css';

const STATUSES: StatusRole[] = ['PENDING', 'APPROVED', 'REJECTED'];
const STATUS_LABELS: Record<StatusRole, string> = {
    PENDING: 'На рассмотрении',
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
    onAnswer: (app: RoleResponse) => void;
}

const ApplicationsTab: React.FC<Props> = ({
    applications, page, totalPages, statusFilter, loading,
    onPageChange, onStatusFilter, onAnswer
}) => (
    <div className="apps-tab">
        {/* Фильтр по статусу */}
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
                    <div key={i} className="app-card">
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
                            <p className="app-card__answer">Ответ: {app.answerAdmin}</p>
                        )}

                        <div className="app-card__footer">
                            <span className="app-card__date">
                                {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                            {app.statusRole === 'PENDING' && (
                                <button className="app-card__btn" onClick={() => onAnswer(app)}>
                                    Ответить
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}

        <AdminPagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </div>
);

export default ApplicationsTab;
