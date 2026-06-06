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

                // 1. Получаем текущего пользователя
                const userRes = await getCurrentUser();
                const user = userRes.data;
                setUserData(user);

                // 2. Получаем подписку по id пользователя
                const subRes = await getSubscription(user.id);
                setSubscription(subRes.data);

                // 3. Получаем заявки на роль (берём последнюю)
                const rolesRes = await getUserRoles();
                const roles = rolesRes.data;
                if (roles.length > 0) {
                    setRoleRequest(roles[roles.length - 1]);
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
        // После отправки перезапрашиваем заявки
        const rolesRes = await getUserRoles();
        const roles = rolesRes.data;
        if (roles.length > 0) {
            setRoleRequest(roles[roles.length - 1]);
        }
    };

    return { userData, subscription, roleRequest, loading, error, submitRoleRequest };
};