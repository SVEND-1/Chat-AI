import React from 'react';
import type { PaymentResponse, ReceiptResponse } from '../../api/paymentApi';
import ReceiptDetails from './ReceiptDetails';
import '../../style/payment-history/PaymentDetails.css';

interface PaymentDetailsProps {
    payment: PaymentResponse;
    receipt: ReceiptResponse | null;
    onCreateReceipt: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, receipt, onCreateReceipt }) => {
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
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

    return (
        <div className="payment-details">
            <h2 className="payment-details__title">Детали платежа</h2>

            <div className="payment-details__card">
                <div className="payment-details__row">
                    <span className="payment-details__label">ID платежа:</span>
                    <span className="payment-details__value">{payment.id}</span>
                </div>

                <div className="payment-details__row">
                    <span className="payment-details__label">Описание:</span>
                    <span className="payment-details__value">{payment.description}</span>
                </div>

                <div className="payment-details__row">
                    <span className="payment-details__label">Сумма:</span>
                    <span className="payment-details__value payment-details__value--amount">
                        {payment.value} ₽
                    </span>
                </div>

                <div className="payment-details__row">
                    <span className="payment-details__label">Статус:</span>
                    <span className={`payment-details__value payment-details__value--status payment-details__value--status-${payment.status}`}>
                        {getStatusText(payment.status)}
                    </span>
                </div>

                <div className="payment-details__row">
                    <span className="payment-details__label">Дата создания:</span>
                    <span className="payment-details__value">{formatDate(payment.createdAt)}</span>
                </div>
            </div>

            <div className="payment-details__receipt-section">
                <h3 className="payment-details__subtitle">Чек</h3>
                <ReceiptDetails receipt={receipt} onCreateReceipt={onCreateReceipt} />
            </div>
        </div>
    );
};

export default PaymentDetails;