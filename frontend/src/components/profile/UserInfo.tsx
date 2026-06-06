// components/profile/UserInfo.tsx
import React from 'react';
import { UserData } from '../../types/profile/profile.types';

interface UserInfoProps {
    userData: UserData;
}

const UserInfo: React.FC<UserInfoProps> = ({ userData }) => {
    const getRoleName = (role: string) => {
        const roles: Record<string, string> = {
            USER: 'Пользователь',
            SUPPORT: 'Техподдержка',
            ADMIN: 'Администратор',
        };
        return roles[role] ?? role;
    };

    return (
        <div className="profile-card user-info-card">
            <h2 className="card-title">Личная информация</h2>

            <div className="user-avatar">
                {userData.avatar ? (
                    <img src={userData.avatar} alt={userData.name} />
                ) : (
                    <div className="avatar-placeholder">
                        {userData.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="user-details">
                <div className="detail-item">
                    <span className="detail-label">Имя:</span>
                    <span className="detail-value">{userData.name}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{userData.email}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Роль:</span>
                    <span className={`detail-value role-badge role-${userData.role.toLowerCase()}`}>
                        {getRoleName(userData.role)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;