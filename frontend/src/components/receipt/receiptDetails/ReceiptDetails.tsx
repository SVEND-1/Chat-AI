import React from 'react';
import type { Receipt } from '../../../types/receipt/receipt.types.ts';
import ReceiptItems from '../receiptItems/ReceiptItems';
import ReceiptFiscal from '../receiptFiscal/ReceiptFiscal';
import styles from './ReceiptDetails.module.css';

interface Props {
  receipt: Receipt;
  loading: boolean;
}

// Форматируем дату + время из ISO строки
const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const ReceiptDetails: React.FC<Props> = ({ receipt, loading }) => {
  if (loading) {
    return <div className={styles.loading}>Загружаем чек...</div>;
  }

  return (
    <div className={styles.wrapper}>
      {/* Шапка чека */}
      <div className={styles.receiptHeader}>
        <div className={styles.shopIcon}>🧾</div>
        <div>
          <h2 className={styles.shopName}>{receipt.sellerName}</h2>
          <p className={styles.receiptDate}>{formatDateTime(receipt.registeredAt)}</p>
        </div>
        <div className={styles.statusBadge}>{receipt.status === 'succeeded' ? 'Оплачен' : receipt.status}</div>
      </div>

      {/* Сумма крупно */}
      <div className={styles.amountBlock}>
        <span className={styles.amountLabel}>Итого</span>
        <span className={styles.amountValue}>{receipt.amount} ₽</span>
      </div>

      {/* Позиции чека */}
      <ReceiptItems items={receipt.items} />

      {/* Фискальные данные */}
      <ReceiptFiscal receipt={receipt} />
    </div>
  );
};

export default ReceiptDetails;
