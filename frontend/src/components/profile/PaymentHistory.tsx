import React from 'react';

interface PaymentHistoryProps {
    onNavigate: () => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ onNavigate }) => {
    return (
        <div className="profile-card action-card">
            <h2 className="card-title">Платежи</h2>

            <div className="action-content">
                <p>Просмотрите историю ваших платежей и скачайте чеки</p>

                <button
                    className="action-button history-button"
                    onClick={onNavigate}
                >
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                        />
                    </svg>
                    <span>История платежей</span>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16" className="arrow-icon">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PaymentHistory;