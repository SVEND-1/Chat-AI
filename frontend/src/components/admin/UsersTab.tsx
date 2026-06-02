import React from 'react';
import type { UserDefaultResponse, Role } from '../../api/adminApi';
import AdminPagination from './AdminPagination';
import '../../style/admin/UsersTab.css';

const ROLES: Role[] = ['USER', 'SUPPORT', 'ADMIN'];
const ROLE_LABELS: Record<Role, string> = { USER: 'Пользователь', SUPPORT: 'Поддержка', ADMIN: 'Админ' };

interface Props {
    users: UserDefaultResponse[];
    page: number;
    totalPages: number;
    roleFilter: Role | undefined;
    loading: boolean;
    onPageChange: (p: number) => void;
    onRoleFilter: (r: Role | undefined) => void;
}

const UsersTab: React.FC<Props> = ({ users, page, totalPages, roleFilter, loading, onPageChange, onRoleFilter }) => (
    <div className="users-tab">
        {/* Фильтр по роли */}
        <div className="admin-filters">
            <button
                className={`admin-filter-btn ${!roleFilter ? 'admin-filter-btn--active' : ''}`}
                onClick={() => onRoleFilter(undefined)}
            >
                Все
            </button>
            {ROLES.map(r => (
                <button
                    key={r}
                    className={`admin-filter-btn ${roleFilter === r ? 'admin-filter-btn--active' : ''}`}
                    onClick={() => onRoleFilter(r)}
                >
                    {ROLE_LABELS[r]}
                </button>
            ))}
        </div>

        {loading ? (
            <div className="admin-loading"><div className="ph-spinner" />Загрузка...</div>
        ) : users.length === 0 ? (
            <div className="admin-empty">Пользователи не найдены</div>
        ) : (
            <div className="users-table">
                <div className="users-table__head">
                    <span>Email</span>
                    <span>Имя</span>
                    <span>Роль</span>
                </div>
                {users.map(u => (
                    <div key={u.id} className="users-table__row">
                        <span className="users-table__email">{u.email}</span>
                        <span className="users-table__name">{u.username}</span>
                        <span className={`users-table__role users-table__role--${u.role.toLowerCase()}`}>
                            {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                    </div>
                ))}
            </div>
        )}

        <AdminPagination page={page} totalPages={totalPages} onChange={onPageChange} />
    </div>
);

export default UsersTab;
