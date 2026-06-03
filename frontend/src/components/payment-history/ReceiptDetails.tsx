import React from 'react';
import type { ReceiptResponse } from '../../api/paymentApi';
import '../../style/payment-history/ReceiptDetails.css';

interface ReceiptDetailsProps {
    receipt: ReceiptResponse | null;
    onCreateReceipt: () => void;
}

const ReceiptDetails: React.FC<ReceiptDetailsProps> = ({ receipt, onCreateReceipt }) => {
    if (!receipt) {
        return (
            <div className="receipt-details receipt-details--empty">
                <p className="receipt-details__empty-text">Чек отсутствует</p>
                <button className="receipt-details__create-button" onClick={onCreateReceipt}>
                    Создать чек
                </button>
            </div>
        );
    }

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

    return (
        <div className="receipt-details">
            <div className="receipt-details__header">
                <span className="receipt-details__id">Чек #{receipt.fiscalDocumentNumber}</span>
                <span className="receipt-details__status">{receipt.status}</span>
            </div>

            <div className="receipt-details__section">
                <h4 className="receipt-details__section-title">Информация о чеке</h4>
                <div className="receipt-details__row">
                    <span className="receipt-details__label">ID чека:</span>
                    <span className="receipt-details__value">{receipt.id}</span>
                </div>
                <div className="receipt-details__row">
                    <span className="receipt-details__label">Тип:</span>
                    <span className="receipt-details__value">{receipt.type}</span>
                </div>
                <div className="receipt-details__row">
                    <span className="receipt-details__label">Сумма:</span>
                    <span className="receipt-details__value">{receipt.amount} ₽</span>
                </div>
                <div className="receipt-details__row">
                    <span className="receipt-details__label">Продавец:</span>
                    <span className="receipt-details__value">{receipt.sellerName}</span>
                </div>
                <div className="receipt-details__row">
                    <span className="receipt-details__label">Зарегистрирован:</span>
                    <span className="receipt-details__value">{formatDate(receipt.registeredAt)}</span>
                </div>
            </div>

            <div className="receipt-details__section">
                <h4 className="receipt-details__section-title">Фискальные данные</h4>
                <div className="receipt-details__row">
                    <span className="receipt-details__label">Номер документа:</span>
                    <span className="receipt-details__value">{receipt.fiscalDocumentNumber}</span>
                </div>
                <div className="receipt-details__row">
                    <span className="receipt-details__label">Номер накопителя:</span>
                    <span className="receipt-details__value">{receipt.fiscalStorageNumber}</span>
                </div>
                <div className="receipt-details__row">
                    <span className="receipt-details__label">Фискальный признак:</span>
                    <span className="receipt-details__value">{receipt.fiscalAttribute}</span>
                </div>
                <div className="receipt-details__row">
                    <span className="receipt-details__label">Провайдер:</span>
                    <span className="receipt-details__value">{receipt.fiscalProviderId}</span>
                </div>
            </div>

            <div className="receipt-details__section">
                <h4 className="receipt-details__section-title">Товары/услуги</h4>
                {receipt.items.map((item, index) => (
                    <div key={index} className="receipt-details__item">
                        <div className="receipt-details__item-row">
                            <span className="receipt-details__item-name">{item.description}</span>
                            <span className="receipt-details__item-price">{item.amountValue} {item.amountCurrency}</span>
                        </div>
                        <div className="receipt-details__item-row receipt-details__item-row--details">
                            <span>Кол-во: {item.quantity}</span>
                            <span>НДС: {item.vatCode}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="receipt-details__section">
                <h4 className="receipt-details__section-title">Расчеты</h4>
                {receipt.settlements.map((settlement, index) => (
                    <div key={index} className="receipt-details__settlement">
                        <span className="receipt-details__settlement-type">{settlement.type}:</span>
                        <span className="receipt-details__settlement-amount">
                            {settlement.amountValue} {settlement.amountCurrency}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReceiptDetails;