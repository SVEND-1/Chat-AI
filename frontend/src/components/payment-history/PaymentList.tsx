import React from 'react';
import type { PaymentResponse } from '../../api/paymentApi';
import { formatDate, getStatusText } from './paymentDetails/payment.utils';
import '../../style/payment-history/PaymentList.css';

interface Props {
    payments: PaymentResponse[];
    selectedId: string | null;
    onSelect: (payment: PaymentResponse) => void;
}

const PaymentList: React.FC<Props> = ({ payments, selectedId, onSelect }) => (
    <div className="payment-list">
        {payments.map(payment => (
            <button
                key={payment.id}
                className={`payment-list__item ${selectedId === payment.id ? 'payment-list__item--active' : ''}`}
                onClick={() => onSelect(payment)}
            >
                <div className="payment-list__item-top">
                    <span className="payment-list__item-desc">{payment.description}</span>
                    <span className={`payment-list__item-status payment-list__item-status--${payment.status}`}>
                        {getStatusText(payment.status)}
                    </span>
                </div>
                <div className="payment-list__item-bottom">
                    <span className="payment-list__item-amount">{payment.value} ₽</span>
                    <span className="payment-list__item-date">{formatDate(payment.createdAt)}</span>
                </div>
            </button>
        ))}
    </div>
);

export default PaymentList;
