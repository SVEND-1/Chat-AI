import React from 'react';
import type { PaymentResponse } from '../../../api/paymentApi';
import { formatDate, getStatusText } from './payment.utils';
import { PaymentRow } from './PaymentRow';

interface Props {
    payment: PaymentResponse;
}

export const PaymentInfo: React.FC<Props> = ({ payment }) => {
    return (
        <div className="payment-details__card">
            <PaymentRow label="ID платежа:" value={payment.id} />

            <PaymentRow label="Описание:" value={payment.description} />

            <PaymentRow
                label="Сумма:"
                value={`${payment.value} ₽`}
                valueClass="payment-details__value--amount"
            />

            <PaymentRow
                label="Статус:"
                value={getStatusText(payment.status)}
                valueClass={`payment-details__value--status payment-details__value--status-${payment.status}`}
            />

            <PaymentRow
                label="Дата создания:"
                value={formatDate(payment.createdAt)}
            />
        </div>
    );
};