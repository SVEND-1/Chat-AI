import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment } from '../../../api/paymentApi';
import { getSubscription, type SubscriptionDetailResponse } from '../../../api/subscriptionApi';

export function useSubscription() {
    const navigate = useNavigate();

    const [subscription, setSubscription] = useState<SubscriptionDetailResponse | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadSubscription();
    }, []);

    const loadSubscription = () => {
        // Сначала смотрим localStorage (быстрый путь — нет лишнего запроса)
        const stored = localStorage.getItem('subscriptionData');
        if (stored) {
            try {
                const data: SubscriptionDetailResponse = JSON.parse(stored);
                if (data.status === 'ACTIVE') {
                    setSubscription(data);
                    setIsSubscribed(true);
                    return;
                }
            } catch {
                localStorage.removeItem('subscriptionData');
            }
        }

        // Если в localStorage ничего нет — пробуем получить id из хранилища и запросить с бэка
        const subId = localStorage.getItem('subscriptionId');
        if (subId) {
            fetchSubscriptionFromApi(Number(subId));
        }
    };

    const fetchSubscriptionFromApi = async (id: number) => {
        try {
            const res = await getSubscription(id);
            const data = res.data;
            if (data.status === 'ACTIVE') {
                setSubscription(data);
                setIsSubscribed(true);
                localStorage.setItem('subscriptionData', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Ошибка загрузки подписки:', error);
        }
    };

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const res = await createPayment();
            const { paymentId, urlPay } = res.data;

            // Сохраняем paymentId — /succeeded-payment прочитает его после редиректа из ЮКассы
            localStorage.setItem('currentPaymentId', paymentId);

            // Редирект в ЮКассу (та же вкладка, вернёт на /succeeded-payment)
            window.location.href = urlPay;
        } catch (error) {
            console.error('Ошибка создания платежа:', error);
            alert('Не удалось создать платёж. Попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        subscription,
        isSubscribed,
        isLoading,
        navigate,
        handleSubscribe,
    };
}
