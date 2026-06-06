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
                        {userData?.role !== 'SUPPORT' && userData?.role !== 'ADMIN' && (
                            <RoleRequest
                                existingRequest={roleRequest}
                                onSubmit={submitRoleRequest}
                            />
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