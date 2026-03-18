import React, { useState } from 'react';
import "../../../style/settingModal/SettingModal.css";
import "../../../style/settingModal/Modal.css";
import { SettingsTab, SettingsModalProps } from '../../../types/Chat/settingModal/settingModal.types';
import GeneralSettings from './GeneralSettings';
import AboutProgram from './AboutProgram';
import AboutUs from './AboutUs';
import logoIcon from '../../../assets/icons/icon.svg';

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');

    const handleProfileClick = () => {
        // Здесь можно открыть профиль или сделать редирект
        window.location.href = '/profile';
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettings />;
            case 'about-program':
                return <AboutProgram />;
            case 'about-us':
                return <AboutUs />;
            case 'profile':
                // Можно либо показывать профиль внутри, либо сделать редирект
                handleProfileClick();
                return null;
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Настройки</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="modal-sidebar">
                        <button
                            className={`modal-sidebar-btn ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => setActiveTab('general')}
                        >
                            <svg viewBox="0 0 24 24" strokeWidth="1.5">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.074-.04.147-.083.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            </svg>
                            Общие
                        </button>

                        <button
                            className={`modal-sidebar-btn ${activeTab === 'about-program' ? 'active' : ''}`}
                            onClick={() => setActiveTab('about-program')}
                        >
                            <svg viewBox="0 0 24 24" strokeWidth="1.5">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                            О программе
                        </button>

                        <button
                            className={`modal-sidebar-btn ${activeTab === 'about-us' ? 'active' : ''}`}
                            onClick={() => setActiveTab('about-us')}
                        >
                            <svg viewBox="0 0 24 24" strokeWidth="1.5">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                            О нас
                        </button>

                        <button
                            className="profile-button"
                            onClick={handleProfileClick}
                        >
                            <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            <span>Перейти в профиль</span>
                            <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18" className="arrow-icon">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>

                    <div className="modal-content-area">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;