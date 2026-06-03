import React from 'react';
import type { ReceiptResponse } from '../../../api/paymentApi';

type Item = ReceiptResponse['items'][number];

const ReceiptItems: React.FC<{ items: Item[] }> = ({ items }) => (
    <div className="receipt-details__section">
        <h4 className="receipt-details__section-title">Товары/услуги</h4>

        {items.map((item, index) => (
            <div key={index} className="receipt-details__item">
                <div className="receipt-details__item-row">
                    <span>{item.description}</span>
                    <span>
                        {item.amountValue} {item.amountCurrency}
                    </span>
                </div>

                <div className="receipt-details__item-row receipt-details__item-row--details">
                    <span>Кол-во: {item.quantity}</span>
                    <span>НДС: {item.vatCode}</span>
                </div>
            </div>
        ))}
    </div>
);

export default ReceiptItems;