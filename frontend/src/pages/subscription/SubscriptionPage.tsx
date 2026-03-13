import React from 'react';
import SubscriptionCard from '../../components/subscription/SubscriptionCard';
import CloseButton from '../../components/subscription/CloseButton';
import '../../style/subscription/SubscriptionPage.css';

const SubscriptionPage: React.FC = () => {
    return (
        <div className="subscription-page-wrapper">
            <div className="subscription-page">
                <CloseButton />
                <div className="subscription-page__container">
                    <div className="subscription-page__header">
                        <h1 className="subscription-page__title">Оформите подписку</h1>
                        <p className="subscription-page__description">
                            Получите доступ ко всем возможностям AI ассистента
                        </p>
                    </div>
                    <SubscriptionCard />
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;