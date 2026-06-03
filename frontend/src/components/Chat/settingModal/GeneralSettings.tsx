import React, { useState } from 'react';

const GeneralSettings: React.FC = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [language, setLanguage] = useState('ru');

    const handleThemeChange = (newTheme: 'dark' | 'light') => {
        setTheme(newTheme);
        // Здесь можно добавить логику смены темы
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <div className="settings-section">
            <h3>Общие настройки</h3>

            <div className="settings-item">
                <span className="settings-item-label">Тема оформления</span>
                <div className="theme-toggle">
                    <button
                        className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('dark')}
                    >
                        Темная
                    </button>
                    <button
                        className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('light')}
                    >
                        Светлая
                    </button>
                </div>
            </div>

            <div className="settings-item">
                <span className="settings-item-label">Язык интерфейса</span>
                <select
                    className="select-input"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                </select>
            </div>

            <div className="settings-item">
                <span className="settings-item-label">Автоматическое воспроизведение видео</span>
                <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    );
};

export default GeneralSettings;