import React, { useState } from 'react';
import { giveSubscription } from '../../api/adminApi';
import '../../style/admin/GiveSubscriptionTab.css';

type State = 'idle' | 'loading' | 'success' | 'error';

const GiveSubscriptionTab: React.FC = () => {
    const [email, setEmail]   = useState('');
    const [state, setState]   = useState<State>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        const trimmed = email.trim();
        if (!trimmed) return;

        setState('loading');
        setMessage('');
        try {
            const res = await giveSubscription(trimmed);
            setMessage(res.data ?? 'Подписка выдана');
            setState('success');
            setEmail('');
        } catch (e: any) {
            setMessage(e.response?.data?.message ?? e.response?.data ?? 'Пользователь не найден или уже имеет подписку');
            setState('error');
        }
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <div className="give-sub-tab">
            <p className="give-sub-tab__desc">
                Введите email пользователя — ему будет выдана Premium-подписка без оплаты.
            </p>

            <div className="give-sub-tab__form">
                <input
                    className="give-sub-tab__input"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setState('idle'); }}
                    onKeyDown={handleKey}
                    disabled={state === 'loading'}
                />
                <button
                    className="give-sub-tab__btn"
                    onClick={handleSubmit}
                    disabled={state === 'loading' || !email.trim()}
                >
                    {state === 'loading' ? 'Выдаём...' : 'Выдать подписку'}
                </button>
            </div>

            {state === 'success' && (
                <div className="give-sub-tab__feedback give-sub-tab__feedback--success">
                    ✓ {message}
                </div>
            )}
            {state === 'error' && (
                <div className="give-sub-tab__feedback give-sub-tab__feedback--error">
                    ✗ {message}
                </div>
            )}
        </div>
    );
};

export default GiveSubscriptionTab;
