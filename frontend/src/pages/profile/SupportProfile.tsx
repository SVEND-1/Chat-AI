// pages/profile/SupportProfile.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/profile/profile-main.css';
import '../../style/profile/profile-card.css';
import '../../style/profile/user-info.css';
import '../../style/profile/support-ticket-list.css';

import UserInfo from '../../components/profile/UserInfo';
import SupportTicketList from '../../components/profile/SupportTicketList';
import { useProfile } from './useProfile';

const SupportProfile: React.FC = () => {
    const navigate = useNavigate();
    const { userData, supportTickets, loading, error } = useProfile();

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-loading">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1 className="profile-title">Профиль техподдержки</h1>
                    <button
                        className="back-to-chat-button"
                        onClick={() => navigate('/profile')}
                        aria-label="Вернуться в профиль"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M19 12H5M5 12L12 19M5 12L12 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Вернуться в профиль
                    </button>
                </div>

                <div className="profile-grid">
                    <div className="profile-left">
                        {userData && <UserInfo userData={userData} />}
                    </div>
                    <div className="profile-right">
                        <SupportTicketList tickets={supportTickets} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportProfile;