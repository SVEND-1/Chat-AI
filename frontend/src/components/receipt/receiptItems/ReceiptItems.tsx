import React from 'react';
import type { ReceiptItem } from '../../../types/receipt/receipt.types.ts';
import styles from './ReceiptItems.module.css';

interface Props {
  items: ReceiptItem[];
}

const ReceiptItems: React.FC<Props> = ({ items }) => (
  <div className={styles.card}>
    <h3 className={styles.cardTitle}>Состав заказа</h3>

    <div className={styles.tableHead}>
      <span>Наименование</span>
      <span>Кол-во</span>
      <span>Сумма</span>
    </div>

    {items.map((item, idx) => (
      <div key={idx} className={styles.row}>
        <span className={styles.desc}>{item.description}</span>
        <span className={styles.qty}>{item.quantity}</span>
        <span className={styles.amount}>
          {item.amountValue} {item.amountCurrency}
        </span>
      </div>
    ))}
  </div>
);

export default ReceiptItems;
