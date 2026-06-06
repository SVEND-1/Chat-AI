import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment, getPayments, getReceipt, createReceipt } from '../../api/paymentApi';
import { createSubscription } from '../../api/subscriptionApi';
import type { PaymentResponse, ReceiptResponse } from '../../api/paymentApi';

const ITEMS_PER_PAGE = 10;
const POLL_INTERVAL  = 3000;
const POLL_TIMEOUT   = 300000; // 5 минут

export function usePaymentHistory() {
    const navigate = useNavigate();

    const [payments, setPayments]               = useState<PaymentResponse[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);
    const [receipt, setReceipt]                 = useState<ReceiptResponse | null>(null);
    const [currentPage, setCurrentPage]         = useState(0);
    const [totalPages, setTotalPages]           = useState(1);
    const [isLoading, setIsLoading]             = useState(false);
    const [isCreatingPayment, setIsCreatingPayment] = useState(false);

    useEffect(() => {
        loadPayments(currentPage);
    }, [currentPage]);

    const loadPayments = async (page: number) => {
        setIsLoading(true);
        try {
            const res = await getPayments(page, ITEMS_PER_PAGE);
            setPayments(res.data.content ?? []);
            setTotalPages(res.data.totalPages || 1);
        } catch (error) {
            console.error('Ошибка загрузки платежей:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedPayment(null);
        setReceipt(null);
    };

    const handleSelectPayment = async (payment: PaymentResponse) => {
        setSelectedPayment(payment);
        setReceipt(null);
        try {
            const res = await getReceipt(payment.id);
            setReceipt(res.data);
        } catch {
            setReceipt(null);
        }
    };

    // Создание платежа — открываем ЮКассу в новой вкладке, polling в фоне
    const handleCreatePayment = async () => {
        setIsCreatingPayment(true);
        try {
            const res = await createPayment();
            const { paymentId, urlPay } = res.data;

            localStorage.setItem('currentPaymentId', paymentId);
            window.open(urlPay, '_blank');
            startPaymentStatusPolling(paymentId);
        } catch (error) {
            console.error('Ошибка создания платежа:', error);
            alert('Ошибка при создании платежа. Попробуйте позже.');
        } finally {
            setIsCreatingPayment(false);
        }
    };

    const startPaymentStatusPolling = (paymentId: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await getPayments(0, ITEMS_PER_PAGE);
                const found = res.data.content.find(p => p.id === paymentId);

                if (found?.status === 'succeeded') {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    localStorage.removeItem('currentPaymentId');
                    await activateSubscription(paymentId);
                    loadPayments(currentPage);
                }
            } catch (error) {
                console.error('Ошибка polling платежа:', error);
            }
        }, POLL_INTERVAL);

        const timeout = setTimeout(() => clearInterval(interval), POLL_TIMEOUT);
    };

    const activateSubscription = async (paymentId: string) => {
        try {
            await createSubscription(paymentId);
            alert('✅ Подписка успешно оформлена!');
        } catch (error: any) {
            console.error('Ошибка оформления подписки:', error.response?.data || error.message);
            alert(`❌ Ошибка: ${error.response?.data?.message || 'Неизвестная ошибка'}`);
        }
    };

    const handleCreateReceipt = async () => {
        if (!selectedPayment) return;
        try {
            const res = await createReceipt(selectedPayment.id);
            setReceipt(res.data);
        } catch (error) {
            console.error('Ошибка создания чека:', error);
            alert('❌ Ошибка при создании чека');
        }
    };

    const handleClose = () => navigate('/chat');

    return {
        payments,
        selectedPayment,
        receipt,
        currentPage,
        totalPages,
        isLoading,
        isCreatingPayment,
        handlePageChange,
        handleSelectPayment,
        handleCreatePayment,
        handleCreateReceipt,
        handleClose,
    };
}
