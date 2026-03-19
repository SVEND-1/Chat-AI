import React from 'react';
import { Payment } from '../../pages/payment-history/PaymentHistoryPage';
import '../../style/payment-history/PaymentList.css';

interface PaymentListProps {
    payments: Payment[];
    selectedId: string | null;
    onSelect: (payment: Payment) => void;
}

const PaymentList: React.FC<PaymentListProps> = ({ payments, selectedId, onSelect }) => {
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'succeeded':
                return 'Успешно';
            case 'pending':
                return 'В обработке';
            case 'failed':
                return 'Ошибка';
            default:
                return status;
        }
    };

    const getStatusClass = (status: string): string => {
        switch (status) {
            case 'succeeded':
                return 'payment-list__item-status--success';
            case 'pending':
                return 'payment-list__item-status--pending';
            case 'failed':
                return 'payment-list__item-status--failed';
            default:
                return '';
        }
    };

    return (
        <div className="payment-list">
            <h3 className="payment-list__title">История платежей</h3>
            <div className="payment-list__items">
                {payments.map((payment) => (
                    <div
                        key={payment.id}
                        className={`payment-list__item ${selectedId === payment.id ? 'payment-list__item--selected' : ''}`}
                        onClick={() => onSelect(payment)}
                    >
                        <div className="payment-list__item-header">
                            <span className="payment-list__item-description">{payment.description}</span>
                            <span className={`payment-list__item-status ${getStatusClass(payment.status)}`}>
                {getStatusText(payment.status)}
              </span>
                        </div>
                        <div className="payment-list__item-footer">
                            <span className="payment-list__item-amount">{payment.value} ₽</span>
                            <span className="payment-list__item-date">{formatDate(payment.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentList;