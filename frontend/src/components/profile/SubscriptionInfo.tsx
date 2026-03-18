import React from 'react';
import { SubscriptionData } from '../../types/profile/profile.types';

interface SubscriptionInfoProps {
    subscription: SubscriptionData;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ subscription }) => {
    const getStatusInfo = (status: string) => {
        const statuses = {
            active: { text: 'Активна', className: 'status-active' },
            inactive: { text: 'Неактивна', className: 'status-inactive' },
            expired: { text: 'Истекла', className: 'status-expired' },
            pending: { text: 'Ожидает', className: 'status-pending' }
        };
        return statuses[status as keyof typeof statuses] || statuses.inactive;
    };

    const getPlanName = (plan?: string) => {
        const plans = {
            basic: 'Базовая',
            premium: 'Премиум',
            pro: 'Профессиональная'
        };
        return plan ? plans[plan as keyof typeof plans] : 'Нет подписки';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const statusInfo = getStatusInfo(subscription.status);

    return (
        <div className="profile-card subscription-card">
            <h2 className="card-title">Подписка</h2>

            <div className="subscription-info">
                <div className="subscription-status">
                    <span className="status-label">Статус:</span>
                    <span className={`status-badge ${statusInfo.className}`}>
                        {statusInfo.text}
                    </span>
                </div>

                {subscription.plan && (
                    <div className="subscription-plan">
                        <span className="plan-label">Тариф:</span>
                        <span className="plan-value">{getPlanName(subscription.plan)}</span>
                    </div>
                )}

                {subscription.endDate && (
                    <div className="subscription-end">
                        <span className="end-label">Действует до:</span>
                        <span className="end-value">{formatDate(subscription.endDate)}</span>
                    </div>
                )}

                <div className="subscription-renew">
                    <span className="renew-label">Автопродление:</span>
                    <span className={`renew-value ${subscription.autoRenew ? 'enabled' : 'disabled'}`}>
                        {subscription.autoRenew ? 'Включено' : 'Отключено'}
                    </span>
                </div>
            </div>

            {subscription.status !== 'active' && (
                <button className="upgrade-button">
                    Оформить подписку
                </button>
            )}
        </div>
    );
};

export default SubscriptionInfo;