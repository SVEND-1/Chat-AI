import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/profile/profile.css';

// Импортируем компоненты
import UserInfo from '../../components/profile/UserInfo';
import RoleRequest from '../../components/profile/RoleRequest';
import SubscriptionInfo from '../../components/profile/SubscriptionInfo';
import PasswordChange from '../../components/profile/PasswordChange';
import PaymentHistory from '../../components/profile/PaymentHistory';

// Импортируем типы
import { UserData, SubscriptionData, RoleRequestData } from '../../types/profile/profile.types';

const Profile: React.FC = () => {
    const navigate = useNavigate();

    // Состояния для данных пользователя
    const [userData, setUserData] = useState<UserData | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [roleRequest, setRoleRequest] = useState<RoleRequestData | null>(null);
    const [loading, setLoading] = useState(true);

    // Загрузка данных (имитация)
    useEffect(() => {
        // TODO: Заменить на реальный API запрос
        const fetchUserData = async () => {
            try {
                // Имитация загрузки
                setTimeout(() => {
                    setUserData({
                        id: '1',
                        name: 'Иван Петров',
                        email: 'ivan.petrov@example.com',
                        role: 'user',
                        createdAt: '2024-01-15T10:00:00Z'
                    });

                    setSubscription({
                        status: 'active',
                        plan: 'premium',
                        startDate: '2024-01-15T10:00:00Z',
                        endDate: '2024-12-15T10:00:00Z',
                        autoRenew: true
                    });

                    setRoleRequest({
                        id: 'req1',
                        userId: '1',
                        requestedRole: 'support',
                        status: 'pending',
                        message: 'Хочу помогать пользователям',
                        createdAt: '2024-02-01T14:30:00Z'
                    });

                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Ошибка загрузки профиля:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Обработчики
    const handlePasswordChange = () => {
        navigate('/forgot-password');
    };

    const handlePaymentHistory = () => {
        navigate('/payment-history');
    };

    const handleRoleRequestSubmit = async (message: string) => {
        try {
            // TODO: API запрос
            console.log('Заявка на роль support:', message);
            // Обновляем статус заявки
            setRoleRequest({
                id: 'req1',
                userId: '1',
                requestedRole: 'support',
                status: 'pending',
                message: message,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Ошибка отправки заявки:', error);
        }
    };

    const handleBackToChat = () => {
        navigate('/chat');
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Загрузка профиля...</p>
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
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
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
                    {/* Левая колонка - основная информация */}
                    <div className="profile-left">
                        {userData && <UserInfo userData={userData} />}

                        {userData?.role !== 'support' && (
                            <RoleRequest
                                existingRequest={roleRequest}
                                onSubmit={handleRoleRequestSubmit}
                                userRole={userData?.role || 'user'}
                            />
                        )}
                    </div>

                    {/* Правая колонка - подписка и действия */}
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