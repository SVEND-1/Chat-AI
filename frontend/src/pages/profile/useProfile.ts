// pages/profile/useProfile.ts
import { useState, useEffect } from 'react';
import { UserData, SubscriptionData, RoleRequestData } from '../../types/profile/profile.types';
import { getCurrentUser } from "../../api/profileApi";
import { getSubscription } from "../../api/subscriptionApi";
import { getUserRoles, createRoleRequest } from "../../api/rolesApi";

interface UseProfileReturn {
    userData: UserData | null;
    subscription: SubscriptionData | null;
    roleRequest: RoleRequestData | null;
    loading: boolean;
    error: string | null;
    submitRoleRequest: (message: string) => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [roleRequest, setRoleRequest] = useState<RoleRequestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Пользователь — критичный запрос, если упал — показываем ошибку
                const userRes = await getCurrentUser();
                const user = userRes.data;
                setUserData(user);

                // 2. Подписка — некритичная, может не быть
                try {
                    const subRes = await getSubscription(user.id);
                    setSubscription(subRes.data);
                } catch {
                    setSubscription(null);
                }

                // 3. Заявки на роль — некритичные, могут отсутствовать
                try {
                    const rolesRes = await getUserRoles();
                    const roles = rolesRes.data;
                    if (roles.length > 0) {
                        setRoleRequest(roles[roles.length - 1]);
                    }
                } catch {
                    setRoleRequest(null);
                }

            } catch (err) {
                setError('Ошибка загрузки данных профиля');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const submitRoleRequest = async (message: string) => {
        await createRoleRequest(message);
        try {
            const rolesRes = await getUserRoles();
            const roles = rolesRes.data;
            if (roles.length > 0) {
                setRoleRequest(roles[roles.length - 1]);
            }
        } catch {
            // игнорируем
        }
    };

    return { userData, subscription, roleRequest, loading, error, submitRoleRequest };
};