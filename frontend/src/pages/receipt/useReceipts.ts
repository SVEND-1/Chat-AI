import { useEffect, useState } from 'react';
import type { Payment, Receipt } from '../../types/receipt/receipt.types';
import { getPayments, createPayment } from '../../api/paymentApi';
import { getReceipt } from '../../api/receiptApi';

export function useReceipts(page = 0, size = 10) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
    const [loading, setLoading] = useState(false);
    const [receiptLoading, setReceiptLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Загружаем список платежей при монтировании / смене страницы
    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getPayments(page, size);
            setPayments(res.data.content ?? []);
        } catch {
            setError('Не удалось загрузить историю платежей');
        } finally {
            setLoading(false);
        }
    };

    // Загружаем чек по paymentId при клике на платёж в списке
    const fetchReceiptById = async (paymentId: string) => {
        try {
            setReceiptLoading(true);
            setError(null);
            const res = await getReceipt(paymentId);
            setSelectedReceipt(res.data);
        } catch {
            setError('Не удалось загрузить чек');
        } finally {
            setReceiptLoading(false);
        }
    };

    // Создать платёж — редиректит на ЮКассу
    const handleCreatePayment = async () => {
        try {
            const res = await createPayment();
            window.location.href = res.data.urlPay;
        } catch {
            setError('Не удалось создать платёж');
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [page, size]);

    return {
        payments,           // список платежей — именно payments, не receipts
        selectedReceipt,
        loading,
        receiptLoading,
        error,
        fetchReceiptById,
        createPayment: handleCreatePayment,
        refetch: fetchPayments,
    };
}
