import React from 'react';
import styles from '../../../pages/subscription/succesSubscription/SuccessSubscriptionPage.module.css';

interface Props {
    onGoToReceipts: () => void;
    onGoToMain: () => void;
}

// Состояние успеха — подписка активирована, чек создан
const ActivationSuccess: React.FC<Props> = ({ onGoToReceipts, onGoToMain }) => (
    <div className={styles.page}>
        <div className={styles.card}>
            <div className={styles.icon}>🎉</div>
            <h2 className={styles.title}>Подписка активирована!</h2>
            <p className={styles.text}>
                Добро пожаловать в Premium. Чек сохранён и доступен в истории платежей.
            </p>
            <button className={styles.btn} onClick={onGoToReceipts}>
                Посмотреть чек
            </button>
            <button className={styles.btnSecondary} onClick={onGoToMain}>
                На главную
            </button>
        </div>
    </div>
);

export default ActivationSuccess;
