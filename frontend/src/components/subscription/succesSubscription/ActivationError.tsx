import React from 'react';
import styles from '../../../pages/subscription/succesSubscription/SuccessSubscriptionPage.module.css';

interface Props {
    message: string;
    onGoToReceipts: () => void;
    onGoToMain: () => void;
}

// Состояние ошибки — оплата прошла, но активация упала
const ActivationError: React.FC<Props> = ({ message, onGoToReceipts, onGoToMain }) => (
    <div className={styles.page}>
        <div className={styles.card}>
            <div className={styles.icon}>⚠️</div>
            <h2 className={styles.title}>Что-то пошло не так</h2>
            <p className={styles.text}>{message}</p>
            <button className={styles.btn} onClick={onGoToReceipts}>
                Посмотреть чеки
            </button>
            <button className={styles.btnSecondary} onClick={onGoToMain}>
                На главную
            </button>
        </div>
    </div>
);

export default ActivationError;
