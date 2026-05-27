import React from 'react';

interface Props {
    label: string;
    value: React.ReactNode;
    valueClass?: string;
}

export const PaymentRow: React.FC<Props> = ({
                                                label,
                                                value,
                                                valueClass = ''
                                            }) => {
    return (
        <div className="payment-details__row">
            <span className="payment-details__label">{label}</span>
            <span className={`payment-details__value ${valueClass}`}>
                {value}
            </span>
        </div>
    );
};