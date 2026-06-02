import React from 'react';
import type { PaymentResponse, ReceiptResponse } from '../../../api/paymentApi';
import ReceiptDetails from '../receipt/ReceiptDetails';
import { PaymentInfo } from './PaymentInfo';
import '../../../style/payment-history/PaymentDetails.css';

interface Props {
    payment: PaymentResponse;
    receipt: ReceiptResponse | null;
    onCreateReceipt: () => void;
}

const PaymentDetails: React.FC<Props> = ({ payment, receipt, onCreateReceipt }) => (
    <div className="payment-details">
        <h2 className="payment-details__title">Детали платежа</h2>
        <PaymentInfo payment={payment} />
        <div className="payment-details__receipt-section">
            <h3 className="payment-details__subtitle">Чек</h3>
            <ReceiptDetails receipt={receipt} onCreateReceipt={onCreateReceipt} />
        </div>
    </div>
);

export default PaymentDetails;
