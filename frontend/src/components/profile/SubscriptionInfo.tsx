// components/profile/SubscriptionInfo.tsx
import React from 'react';
import { SubscriptionData } from '../../types/profile/profile.types';

interface SubscriptionInfoProps {
    subscription: SubscriptionData;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ subscription }) => {
    const getStatusInfo = (status: string) => {
        const statuses: Record<string, { text: string; className: string }> = {
            ACTIVE: { text: 'Активна', className: 'status-active' },
            BLOCKED: { text: 'Заблокирована', className: 'status-inactive' },
        };
        return statuses[status] ?? { text: status, className: 'status-inactive' };
    };

    const statusInfo = getStatusInfo(subscription.status);
    const isActive = subscription.status === 'ACTIVE';

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

                {subscription.endDate && (
                    <div className="subscription-end">
                        <span className="end-label">Действует до:</span>
                        <span className="end-value">{subscription.endDate}</span>
                    </div>
                )}
            </div>

            {!isActive && (
                <button className="upgrade-button">
                    Оформить подписку
                </button>
            )}
        </div>
    );
};

export default SubscriptionInfo;