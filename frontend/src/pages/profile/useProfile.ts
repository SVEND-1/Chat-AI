// pages/profile/useProfile.ts
import { useState, useEffect } from 'react';
import { UserData, SubscriptionData, RoleRequestData } from '../../types/profile/profile.types';
import { getCurrentUser } from '../../api/profileApi';
import { getSubscription } from '../../api/subscriptionApi';
import { getUserRoles, createRoleRequest } from '../../api/rolesApi';
import { getSupportTickets, SupportTicketResponse } from '../../api/supportTicketApi';

interface UseProfileReturn {
    userData: UserData | null;
    subscription: SubscriptionData | null;
    roleRequest: RoleRequestData | null;
    supportTickets: SupportTicketResponse[];
    loading: boolean;
    error: string | null;
    submitRoleRequest: (message: string) => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [roleRequest, setRoleRequest] = useState<RoleRequestData | null>(null);
    const [supportTickets, setSupportTickets] = useState<SupportTicketResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                setError(null);

                const userRes = await getCurrentUser();
                const user = userRes.data;
                setUserData(user);

                try {
                    const subRes = await getSubscription(user.id);
                    setSubscription(subRes.data);
                } catch {
                    setSubscription(null);
                }

                if (user.role === 'SUPPORT') {
                    try {
                        const ticketsRes = await getSupportTickets();
                        setSupportTickets(ticketsRes.data);
                    } catch {
                        setSupportTickets([]);
                    }
                } else {
                    try {
                        const rolesRes = await getUserRoles();
                        const roles = rolesRes.data;
                        if (roles.length > 0) {
                            setRoleRequest(roles[roles.length - 1]);
                        }
                    } catch {
                        setRoleRequest(null);
                    }
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

    return { userData, subscription, roleRequest, supportTickets, loading, error, submitRoleRequest };
};