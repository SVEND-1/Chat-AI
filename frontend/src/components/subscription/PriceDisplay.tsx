import React from 'react';
import '../../style/subscription/PriceDisplay.css';

interface PriceDisplayProps {
    amount: number;
    currency: string;
    period: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ amount, currency, period }) => {
    return (
        <div className="price-display">
            <span className="price-display__amount">{amount}</span>
            <span className="price-display__currency">{currency}</span>
            <span className="price-display__period">/{period}</span>
        </div>
    );
};

export default PriceDisplay;