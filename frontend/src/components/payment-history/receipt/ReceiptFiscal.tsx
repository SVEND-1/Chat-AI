import React from 'react';
import type { ReceiptResponse } from '../../../api/paymentApi';

const ReceiptFiscal: React.FC<{ receipt: ReceiptResponse }> = ({ receipt }) => (
    <div className="receipt-details__section">
        <h4 className="receipt-details__section-title">Фискальные данные</h4>

        <Row label="Номер документа:" value={receipt.fiscalDocumentNumber} />
        <Row label="Номер накопителя:" value={receipt.fiscalStorageNumber} />
        <Row label="Фискальный признак:" value={receipt.fiscalAttribute} />
        <Row label="Провайдер:" value={receipt.fiscalProviderId} />
    </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="receipt-details__row">
        <span className="receipt-details__label">{label}</span>
        <span className="receipt-details__value">{value}</span>
    </div>
);

export default ReceiptFiscal;