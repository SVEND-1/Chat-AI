import React from 'react';
import type { SubscriptionDetailResponse } from '../../../api/subscriptionApi';
import '../../../style/subscription/ActiveSubscriptionCard.css';

interface Props {
    subscription: SubscriptionDetailResponse;
    isLoading: boolean;
    onExtend: () => void;
}

const ActiveSubscriptionCard: React.FC<Props> = ({ subscription, isLoading, onExtend }) => (
    <div className="active-subscription-card">
        <div className="active-subscription-card__header">
            <div className="active-subscription-card__badge">✓ Активна</div>
            <h2 className="active-subscription-card__title">AI Assistant Pro</h2>
            <p className="active-subscription-card__subtitle">Премиум подписка активна</p>
        </div>

        <div className="active-subscription-card__info">
            <div className="active-subscription-card__row">
                <span className="active-subscription-card__label">Статус</span>
                <span className="active-subscription-card__value active-subscription-card__value--active">
                    Активна
                </span>
            </div>
            {subscription.endDate && (
                <div className="active-subscription-card__row">
                    <span className="active-subscription-card__label">Действует до</span>
                    <span className="active-subscription-card__value">{subscription.endDate}</span>
                </div>
            )}
        </div>

        <button
            className="active-subscription-card__button"
            onClick={onExtend}
            disabled={isLoading}
        >
            {isLoading ? 'Обработка...' : 'Продлить подписку'}
        </button>
    </div>
);

export default ActiveSubscriptionCard;
