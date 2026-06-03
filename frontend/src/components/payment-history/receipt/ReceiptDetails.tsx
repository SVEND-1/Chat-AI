import React from 'react';
import type { ReceiptResponse } from '../../../api/paymentApi';
import ReceiptEmpty from './ReceiptEmpty';
import ReceiptHeader from './ReceiptHeader';
import ReceiptInfo from './ReceiptInfo';
import ReceiptFiscal from './ReceiptFiscal';
import ReceiptItems from './ReceiptItems';
import ReceiptSettlements from './ReceiptSettlements';
import '../../../style/payment-history/ReceiptDetails.css';

interface Props {
    receipt: ReceiptResponse | null;
    onCreateReceipt: () => void;
}

const ReceiptDetails: React.FC<Props> = ({ receipt, onCreateReceipt }) => {
    if (!receipt) return <ReceiptEmpty onCreateReceipt={onCreateReceipt} />;

    return (
        <div className="receipt-details">
            <ReceiptHeader receipt={receipt} />
            <ReceiptInfo receipt={receipt} />
            <ReceiptFiscal receipt={receipt} />
            <ReceiptItems items={receipt.items} />
            <ReceiptSettlements settlements={receipt.settlements} />
        </div>
    );
};

export default ReceiptDetails;
