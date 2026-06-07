import React from 'react';
import { useAdmin } from './useAdmin';
import CloseButton from '../../components/subscription/subscription/CloseButton';
import AdminStats from '../../components/admin/AdminStats';
import UsersTab from '../../components/admin/UsersTab';
import ApplicationsTab from '../../components/admin/ApplicationsTab';
import GiveSubscriptionTab from '../../components/admin/GiveSubscriptionTab';
import AnswerModal from '../../components/admin/AnswerModal';
import '../../style/admin/AdminPage.css';

const AdminPage: React.FC = () => {
    const state = useAdmin();

    return (
        <div className="admin-page">
            <CloseButton onClose={() => state.navigate('/chat')} />

            <div className="admin-page__header">
                <h1 className="admin-page__title">Панель администратора</h1>
                <p className="admin-page__subtitle">Управление пользователями и заявками</p>
            </div>

            <AdminStats
                totalUsers={state.totalUsers}
                subsPercent={state.subsPercent}
            />

            <div className="admin-tabs">
                <button
                    className={`admin-tabs__btn ${state.activeTab === 'users' ? 'admin-tabs__btn--active' : ''}`}
                    onClick={() => state.setActiveTab('users')}
                >
                    Пользователи
                </button>
                <button
                    className={`admin-tabs__btn ${state.activeTab === 'applications' ? 'admin-tabs__btn--active' : ''}`}
                    onClick={() => state.setActiveTab('applications')}
                >
                    Заявки на роль
                </button>
                <button
                    className={`admin-tabs__btn ${state.activeTab === 'subscription' ? 'admin-tabs__btn--active' : ''}`}
                    onClick={() => state.setActiveTab('subscription')}
                >
                    Выдать подписку
                </button>
            </div>

            <div className="admin-page__content">
                {state.activeTab === 'users' && (
                    <UsersTab
                        users={state.users}
                        page={state.usersPage}
                        totalPages={state.usersTotalPages}
                        roleFilter={state.usersRoleFilter}
                        loading={state.usersLoading}
                        onPageChange={state.setUsersPage}
                        onRoleFilter={state.handleUsersRoleFilter}
                    />
                )}
                {state.activeTab === 'applications' && (
                    <ApplicationsTab
                        applications={state.applications}
                        page={state.appsPage}
                        totalPages={state.appsTotalPages}
                        statusFilter={state.appsStatusFilter}
                        loading={state.appsLoading}
                        onPageChange={state.setAppsPage}
                        onStatusFilter={state.handleAppsStatusFilter}
                        onAnswer={state.setAnswerTarget}
                    />
                )}
                {state.activeTab === 'subscription' && (
                    <GiveSubscriptionTab />
                )}
            </div>

            {state.answerTarget && (
                <AnswerModal
                    application={state.answerTarget}
                    answerText={state.answerText}
                    loading={state.answerLoading}
                    onTextChange={state.setAnswerText}
                    onSubmit={state.handleAnswerSubmit}
                    onClose={() => { state.setAnswerTarget(null); state.setAnswerText(''); }}
                />
            )}
        </div>
    );
};

export default AdminPage;
