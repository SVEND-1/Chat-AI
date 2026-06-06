import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getUsers,
    getUsersAmount,
    getSubscriptionsPercent,
    getRoleApplications,
    answerRoleApplication,
    type Role,
    type StatusRole,
    type UserDefaultResponse,
    type RoleResponse,
} from '../../api/adminApi';

export type AdminTab = 'users' | 'applications';

const PAGE_SIZE = 10;

export function useAdmin() {
    const navigate = useNavigate();

    // ── Tabs ──
    const [activeTab, setActiveTab] = useState<AdminTab>('users');

    // ── Stats ──
    const [totalUsers, setTotalUsers]   = useState<number | null>(null);
    const [subsPercent, setSubsPercent] = useState<number | null>(null);

    // ── Users tab ──
    const [users, setUsers]             = useState<UserDefaultResponse[]>([]);
    const [usersPage, setUsersPage]     = useState(0);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [usersRoleFilter, setUsersRoleFilter] = useState<Role | undefined>(undefined);
    const [usersLoading, setUsersLoading]       = useState(false);

    // ── Applications tab ──
    const [applications, setApplications]       = useState<RoleResponse[]>([]);
    const [appsPage, setAppsPage]               = useState(0);
    const [appsTotalPages, setAppsTotalPages]   = useState(1);
    const [appsStatusFilter, setAppsStatusFilter] = useState<StatusRole | undefined>(undefined);
    const [appsLoading, setAppsLoading]         = useState(false);
    const [answerTarget, setAnswerTarget]       = useState<RoleResponse | null>(null);
    const [answerText, setAnswerText]           = useState('');
    const [answerLoading, setAnswerLoading]     = useState(false);

    // ── Init ──
    useEffect(() => { loadStats(); }, []);
    useEffect(() => { loadUsers(); }, [usersPage, usersRoleFilter]);
    useEffect(() => { loadApplications(); }, [appsPage, appsStatusFilter]);

    const loadStats = async () => {
        try {
            const [amountRes, subsRes] = await Promise.all([
                getUsersAmount(),
                getSubscriptionsPercent(),
            ]);
            setTotalUsers(amountRes.data.usersAmount);
            setSubsPercent(subsRes.data.subscriptionsPercent);
        } catch (e) {
            console.error('Ошибка загрузки статистики:', e);
        }
    };

    const loadUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const res = await getUsers(PAGE_SIZE, usersPage, usersRoleFilter);
            setUsers(res.data ?? []);
            // Бэк возвращает List, не Page — считаем страницы вручную
            setUsersTotalPages(res.data.length < PAGE_SIZE ? usersPage + 1 : usersPage + 2);
        } catch (e) {
            console.error('Ошибка загрузки пользователей:', e);
        } finally {
            setUsersLoading(false);
        }
    }, [usersPage, usersRoleFilter]);

    const loadApplications = useCallback(async () => {
        setAppsLoading(true);
        try {
            const res = await getRoleApplications(PAGE_SIZE, appsPage, appsStatusFilter);
            setApplications(res.data ?? []);
            setAppsTotalPages(res.data.length < PAGE_SIZE ? appsPage + 1 : appsPage + 2);
        } catch (e) {
            console.error('Ошибка загрузки заявок:', e);
        } finally {
            setAppsLoading(false);
        }
    }, [appsPage, appsStatusFilter]);

    const handleUsersRoleFilter = (role: Role | undefined) => {
        setUsersRoleFilter(role);
        setUsersPage(0);
    };

    const handleAppsStatusFilter = (status: StatusRole | undefined) => {
        setAppsStatusFilter(status);
        setAppsPage(0);
    };

    const handleAnswerSubmit = async (statusRole: StatusRole) => {
        if (!answerTarget) return;
        setAnswerLoading(true);
        try {
            await answerRoleApplication(answerTarget.id, {
                answerAdmin: answerText,
                statusRole,
            });
            setAnswerTarget(null);
            setAnswerText('');
            loadApplications();
        } catch (e) {
            console.error('Ошибка ответа на заявку:', e);
            alert('Ошибка при отправке ответа');
        } finally {
            setAnswerLoading(false);
        }
    };

    return {
        activeTab, setActiveTab,
        totalUsers, subsPercent,
        // users
        users, usersPage, setUsersPage, usersTotalPages,
        usersRoleFilter, handleUsersRoleFilter, usersLoading,
        // applications
        applications, appsPage, setAppsPage, appsTotalPages,
        appsStatusFilter, handleAppsStatusFilter, appsLoading,
        answerTarget, setAnswerTarget,
        answerText, setAnswerText,
        answerLoading, handleAnswerSubmit,
        navigate,
    };
}
