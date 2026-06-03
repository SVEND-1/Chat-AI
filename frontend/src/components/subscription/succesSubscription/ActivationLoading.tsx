import React from 'react';
import styles from '../../../pages/subscription/succesSubscription/SuccessSubscriptionPage.module.css';

// Состояние загрузки — пока идут запросы к API
const ActivationLoading: React.FC = () => (
    <div className={styles.page}>
        <div className={styles.card}>
            <div className={styles.spinner} />
            <p className={styles.text}>Активируем подписку...</p>
        </div>
    </div>
);

export default ActivationLoading;
