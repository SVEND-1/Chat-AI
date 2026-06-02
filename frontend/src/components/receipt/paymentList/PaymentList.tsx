import React from 'react';
import type { Payment } from '../../../types/receipt/receipt.types.ts';
import styles from './PaymentList.module.css';

interface Props {
  payments: Payment[];
  selectedPaymentId: string | null; // совпадает с selectedReceipt.paymentId
  loading: boolean;
  onSelect: (paymentId: string) => void;
  onBuyPremium: () => void;
}

// Форматируем дату из ISO в читаемый вид
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
};

const PaymentList: React.FC<Props> = ({ payments = [], selectedPaymentId, loading, onSelect, onBuyPremium }) => (
  <aside className={styles.sidebar}>
    <div className={styles.top}>
      <h2 className={styles.title}>История платежей</h2>

      {/* Кнопка покупки премиума — редирект на ЮКассу */}
      <button className={styles.buyBtn} onClick={onBuyPremium}>
        ✦ Купить Premium
      </button>
    </div>

    {loading && <p className={styles.hint}>Загрузка...</p>}

    {!loading && payments.length === 0 && (
      <p className={styles.hint}>Платежей пока нет</p>
    )}

    <div className={styles.list}>
      {payments.map((payment) => (
        <div
          key={payment.id}
          className={`${styles.item} ${selectedPaymentId === payment.id ? styles.active : ''}`}
          onClick={() => onSelect(payment.id)}
        >
          <div className={styles.itemTitle}>{payment.description || 'Подписка Premium'}</div>
          <div className={styles.itemMeta}>
            <span className={styles.itemAmount}>{payment.value} ₽</span>
            <span className={`${styles.itemStatus} ${styles[payment.status.toLowerCase()] ?? ''}`}>
              {payment.status === 'succeeded' ? 'Оплачен' : payment.status}
            </span>
          </div>
          <div className={styles.itemDate}>{formatDate(payment.createdAt)}</div>
        </div>
      ))}
    </div>
  </aside>
);

export default PaymentList;
