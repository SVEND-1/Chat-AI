import React from 'react';

interface PasswordChangeProps {
    onNavigate: () => void;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({ onNavigate }) => {
    return (
        <div className="profile-card action-card">
            <h2 className="card-title">Безопасность</h2>

            <div className="action-content">
                <p>Регулярно меняйте пароль для защиты вашего аккаунта</p>

                <button
                    className="action-button password-button"
                    onClick={onNavigate}
                >
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                        />
                    </svg>
                    <span>Сменить пароль</span>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16" className="arrow-icon">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PasswordChange;