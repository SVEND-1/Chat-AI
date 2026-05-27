import React from 'react';
import SubscriptionCard from '../../../components/subscription/subscription/SubscriptionCard';
import ActiveSubscriptionCard from '../../../components/subscription/subscription/ActiveSubscriptionCard';
import CloseButton from '../../../components/subscription/subscription/CloseButton';
import { useSubscription } from './useSubscription';
import '../../../style/subscription/SubscriptionPage.css';

const SubscriptionPage: React.FC = () => {
    const { subscription, isSubscribed, isLoading, handleSubscribe } = useSubscription();

    return (
        <div className="subscription-page-wrapper">
            <div className="subscription-page">
                <CloseButton />
                <div className="subscription-page__container">
                    <div className="subscription-page__header">
                        <h1 className="subscription-page__title">
                            {isSubscribed ? 'Ваша подписка' : 'Оформите подписку'}
                        </h1>
                        <p className="subscription-page__description">
                            {isSubscribed
                                ? 'Управляйте вашим Premium-доступом'
                                : 'Получите доступ ко всем возможностям AI ассистента'
                            }
                        </p>
                    </div>

                    {isSubscribed && subscription ? (
                        <ActiveSubscriptionCard
                            subscription={subscription}
                            isLoading={isLoading}
                            onExtend={handleSubscribe}
                        />
                    ) : (
                        <SubscriptionCard
                            isLoading={isLoading}
                            onSubscribe={handleSubscribe}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
