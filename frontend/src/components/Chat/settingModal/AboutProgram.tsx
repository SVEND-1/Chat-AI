import React from 'react';

const AboutProgram: React.FC = () => {
    return (
        <div className="settings-section">
            <h3>О программе</h3>

            <div className="legal-links">
                <a href="/terms" className="legal-link" target="_blank" rel="noopener noreferrer">
                    <span className="legal-link-left">
                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                        </svg>
                        Условия пользования
                    </span>
                    <span className="legal-link-arrow">
                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                    </span>
                </a>

                <a href="/privacy" className="legal-link" target="_blank" rel="noopener noreferrer">
                    <span className="legal-link-left">
                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Политика конфиденциальности
                    </span>
                    <span className="legal-link-arrow">
                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                    </span>
                </a>

                <a href="/license" className="legal-link" target="_blank" rel="noopener noreferrer">
                    <span className="legal-link-left">
                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                        Лицензионное соглашение
                    </span>
                    <span className="legal-link-arrow">
                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                    </span>
                </a>
            </div>
        </div>
    );
};

export default AboutProgram;