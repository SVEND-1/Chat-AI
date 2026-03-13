import React from 'react';
import '../../style/subscription/FeaturesList.css';

interface FeaturesListProps {
    features: string[];
}

const FeaturesList: React.FC<FeaturesListProps> = ({ features }) => {
    return (
        <ul className="features-list">
            {features.map((feature, index) => (
                <li key={index} className="features-list__item">
                    <svg className="features-list__icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                </li>
            ))}
        </ul>
    );
};

export default FeaturesList;