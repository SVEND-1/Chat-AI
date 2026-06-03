import React from 'react';

interface Props {
    onCreateReceipt: () => void;
}

const ReceiptEmpty: React.FC<Props> = ({ onCreateReceipt }) => (
    <div className="receipt-details receipt-details--empty">
        <p className="receipt-details__empty-text">Чек отсутствует</p>
        <button
            className="receipt-details__create-button"
            onClick={onCreateReceipt}
        >
            Создать чек
        </button>
    </div>
);

export default ReceiptEmpty;