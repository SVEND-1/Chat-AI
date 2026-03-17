import React from 'react';
import logoIcon from '../../../assets/icons/icon.svg';

const AboutUs: React.FC = () => {
    return (
        <div className="settings-section">
            <h3>О нас</h3>

            <div className="about-card">
                <img src={logoIcon} alt="Lumen logo" className="about-logo" />
                <div className="about-title">Lumen</div>
                <div className="about-version">Версия 1.0.0</div>
                <div className="about-description">
                    Lumen - это инновационная нейросеть, созданная для помощи в решении
                    различных задач. Мы стремимся сделать искусственный интеллект доступным
                    и полезным для каждого.
                </div>

                <div className="social-links" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <a href="#" className="social-link" style={{ color: '#b0b0b0', transition: 'color 0.2s' }}>
                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="24" height="24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l9 9m-9 0l9-9" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;