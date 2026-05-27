import React from 'react';
import type { ReceiptResponse } from '../../../api/paymentApi';

const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(dateString));
};

const ReceiptInfo: React.FC<{ receipt: ReceiptResponse }> = ({ receipt }) => (
    <div className="receipt-details__section">
        <h4 className="receipt-details__section-title">Информация о чеке</h4>

        <Row label="ID чека:" value={receipt.id} />
        <Row label="Тип:" value={receipt.type} />
        <Row label="Сумма:" value={`${receipt.amount} ₽`} />
        <Row label="Продавец:" value={receipt.sellerName} />
        <Row label="Зарегистрирован:" value={formatDate(receipt.registeredAt)} />
    </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="receipt-details__row">
        <span className="receipt-details__label">{label}</span>
        <span className="receipt-details__value">{value}</span>
    </div>
);

export default ReceiptInfo;