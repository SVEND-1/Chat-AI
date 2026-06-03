import React from 'react';
import '../../style/admin/AdminStats.css';

interface Props {
    totalUsers: number | null;
    subsPercent: number | null;
}

const AdminStats: React.FC<Props> = ({ totalUsers, subsPercent }) => (
    <div className="admin-stats">
        <div className="admin-stat-card">
            <div className="admin-stat-card__icon">👥</div>
            <div className="admin-stat-card__body">
                <span className="admin-stat-card__label">Всего пользователей</span>
                <span className="admin-stat-card__value">
                    {totalUsers === null ? '—' : totalUsers}
                </span>
            </div>
        </div>
        <div className="admin-stat-card">
            <div className="admin-stat-card__icon">💎</div>
            <div className="admin-stat-card__body">
                <span className="admin-stat-card__label">С активной подпиской</span>
                <span className="admin-stat-card__value">
                    {subsPercent === null ? '—' : `${subsPercent}%`}
                </span>
            </div>
        </div>
    </div>
);

export default AdminStats;
