import React from 'react';
import type { ReceiptResponse } from '../../../api/paymentApi';

const ReceiptHeader: React.FC<{ receipt: ReceiptResponse }> = ({ receipt }) => (
    <div className="receipt-details__header">
        <span className="receipt-details__id">
            Чек #{receipt.fiscalDocumentNumber}
        </span>
        <span className="receipt-details__status">
            {receipt.status}
        </span>
    </div>
);

export default ReceiptHeader;