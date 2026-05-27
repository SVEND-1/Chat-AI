import React from 'react';
import styles from './EmptyReceipt.module.css';

const EmptyReceipt: React.FC = () => (
  <div className={styles.empty}>
    <div className={styles.icon}>🧾</div>
    <p className={styles.title}>Выберите платёж</p>
    <p className={styles.sub}>Нажмите на любой платёж слева, чтобы увидеть чек</p>
  </div>
);

export default EmptyReceipt;
