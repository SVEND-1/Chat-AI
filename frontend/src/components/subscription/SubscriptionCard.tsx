import React from 'react';
import PriceDisplay from './PriceDisplay';
import FeaturesList from './FeaturesList';
import '../../style/subscription/SubscriptionCard.css';

const SubscriptionCard: React.FC = () => {
    const features: string[] = [
        'Неограниченное количество сообщений',
        'Приоритетная поддержка 24/7',
        'Доступ к GPT-4 модели',
        'Загрузка файлов до 100MB'
    ];

    const handleSubscribe = (): void => {
        console.log('Subscribe clicked');
    };

    return (
        <div className="subscription-card">
            <div className="subscription-card__header">
                <div className="subscription-card__logo">
                    <svg width="48" height="48" viewBox="0 0 30 30">
                        <defs>
                            <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0066ff" />
                                <stop offset="100%" stopColor="#66ccff" />
                            </linearGradient>
                        </defs>
                        <path d="M10.24,4A12,12 0 0 0 3,15 12,12 0 0 0 15,27 12,12 0 0 0 25.9,20 12,12 0 0 1 21.14,21 12,12 0 0 1 9.14,9 12,12 0 0 1 10.24,4Z"
                              fill="url(#cardGrad)" />
                    </svg>
                </div>
                <h2 className="subscription-card__title">AI Assistant Pro</h2>
                <p className="subscription-card__subtitle">Премиум доступ к AI чат-боту</p>
            </div>

            <PriceDisplay amount={999} currency="₽" period="месяц" />

            <FeaturesList features={features} />

            <button className="subscription-card__button" onClick={handleSubscribe}>
                Оформить подписку
            </button>

        </div>
    );
};

export default SubscriptionCard;