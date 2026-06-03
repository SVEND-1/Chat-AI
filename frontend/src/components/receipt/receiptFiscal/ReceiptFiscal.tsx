import React from 'react';
import type { Receipt } from '../../../types/receipt/receipt.types.ts';
import styles from './ReceiptFiscal.module.css';

interface Props {
  receipt: Receipt;
}

// Одна строка в фискальном блоке
const FiscalRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className={styles.row}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </div>
);

const ReceiptFiscal: React.FC<Props> = ({ receipt }) => (
  <div className={styles.card}>
    <h3 className={styles.cardTitle}>Фискальные данные</h3>

    <FiscalRow label="Фискальный номер документа" value={receipt.fiscalDocumentNumber} />
    <FiscalRow label="Номер фискального накопителя" value={receipt.fiscalStorageNumber} />
    <FiscalRow label="Фискальный признак" value={receipt.fiscalAttribute} />
    <FiscalRow label="Провайдер" value={receipt.fiscalProviderId} />
    <FiscalRow label="ID чека" value={receipt.id} />
  </div>
);

export default ReceiptFiscal;
