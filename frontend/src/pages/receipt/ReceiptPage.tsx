import React from 'react';
import { useReceipts } from './useReceipts';
import PaymentList from '../../components/receipt/paymentList/PaymentList';
import ReceiptDetails from '../../components/receipt/receiptDetails/ReceiptDetails';
import EmptyReceipt from '../../components/receipt/emptyReceipt/EmptyReceipt';
import styles from './ReceiptsPage.module.css';

export const ReceiptsPage: React.FC = () => {
    const {
        payments,
        selectedReceipt,
        loading,
        receiptLoading,
        error,
        fetchReceiptById,
        createPayment,
    } = useReceipts();

    return (
        <div className={styles.page}>
            {/* Глобальная ошибка */}
            {error && <div className={styles.errorBanner}>{error}</div>}

            {/* Левая часть — список платежей */}
            <PaymentList
                payments={payments}
                selectedPaymentId={selectedReceipt?.paymentId ?? null}
                loading={loading}
                onSelect={fetchReceiptById}
                onBuyPremium={createPayment}
            />

            {/* Правая часть — чек или заглушка */}
            <main className={styles.main}>
                {selectedReceipt ? (
                    <ReceiptDetails receipt={selectedReceipt} loading={receiptLoading} />
                ) : (
                    <EmptyReceipt />
                )}
            </main>
        </div>
    );
};
