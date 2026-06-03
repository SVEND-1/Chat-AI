import React from 'react';
import type { ReceiptResponse } from '../../../api/paymentApi';

type Settlement = ReceiptResponse['settlements'][number];

const ReceiptSettlements: React.FC<{ settlements: Settlement[] }> = ({ settlements }) => (
    <div className="receipt-details__section">
        <h4 className="receipt-details__section-title">Расчеты</h4>

        {settlements.map((s, index) => (
            <div key={index} className="receipt-details__settlement">
                <span>{s.type}:</span>
                <span>
                    {s.amountValue} {s.amountCurrency}
                </span>
            </div>
        ))}
    </div>
);

export default ReceiptSettlements;