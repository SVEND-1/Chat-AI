// pages/profile/Profile.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/profile/profile-main.css';
import '../../style/profile/profile-card.css';
import '../../style/profile/user-info.css';
import '../../style/profile/role-request.css';
import '../../style/profile/subscription-info.css';
import '../../style/profile/action-card.css';

import UserInfo from '../../components/profile/UserInfo';
import RoleRequest from '../../components/profile/RoleRequest';
import SubscriptionInfo from '../../components/profile/SubscriptionInfo';
import PasswordChange from '../../components/profile/PasswordChange';
import PaymentHistory from '../../components/profile/PaymentHistory';
import { useProfile } from './useProfile';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { userData, subscription, roleRequest, loading, error, submitRoleRequest } = useProfile();

    const handlePasswordChange = () => navigate('/forgot-password');
    const handlePaymentHistory = () => navigate('/payment-history');
    const handleBackToChat = () => navigate('/chat');

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

    const isSupport = userData?.role === 'SUPPORT';
    const isAdmin = userData?.role === 'ADMIN';

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1 className="profile-title">Профиль пользователя</h1>
                    <button
                        className="back-to-chat-button"
                        onClick={handleBackToChat}
                        aria-label="Вернуться в чат"
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
                        Вернуться в чат
                    </button>
                </div>

                <div className="profile-grid">
                    <div className="profile-left">
                        {userData && <UserInfo userData={userData} />}
                        {!isSupport && !isAdmin && (
                            <RoleRequest
                                existingRequest={roleRequest}
                                onSubmit={submitRoleRequest}
                            />
                        )}
                        {isSupport && (
                            <div className="profile-card action-card">
                                <h2 className="card-title">Техподдержка</h2>
                                <div className="action-content">
                                    <p>Просмотрите ваши активные тикеты и управляйте обращениями</p>
                                    <button
                                        className="action-button"
                                        onClick={() => navigate('/support-profile')}
                                    >
                                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                                            />
                                        </svg>
                                        <span>Профиль техподдержки</span>
                                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16" className="arrow-icon">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="profile-right">
                        {subscription && <SubscriptionInfo subscription={subscription} />}
                        <PasswordChange onNavigate={handlePasswordChange} />
                        <PaymentHistory onNavigate={handlePaymentHistory} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;