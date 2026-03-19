import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentList from '../../components/payment-history/PaymentList';
import PaymentDetails from '../../components/payment-history/PaymentDetails';
import Pagination from '../../components/payment-history/Pagination';
import CloseButton from '../../components/subscription/CloseButton';
import '../../style/payment-history/PaymentHistoryPage.css';

// Типы данных
export interface Payment {
    id: string;
    value: string;
    description: string;
    status: 'succeeded' | 'pending' | 'failed';
    createdAt: string;
}

export interface ReceiptItem {
    description: string;
    quantity: string;
    amountValue: string;
    amountCurrency: string;
    vatCode: number;
}

export interface SettlementReceipt {
    type: string;
    amountValue: string;
    amountCurrency: string;
}

export interface Receipt {
    id: string;
    type: string;
    paymentId: string;
    status: string;
    amount: string;
    fiscalDocumentNumber: string;
    fiscalStorageNumber: string;
    fiscalAttribute: string;
    registeredAt: string;
    fiscalProviderId: string;
    items: ReceiptItem[];
    settlements: SettlementReceipt[];
    sellerName: string;
}

// Моковые данные для демонстрации
const MOCK_PAYMENTS: Payment[] = [
    {
        id: '1',
        value: '999.00',
        description: 'Оформление подписки AI Assistant Pro',
        status: 'succeeded',
        createdAt: '2024-03-19T10:30:00Z'
    },
    {
        id: '2',
        value: '1999.00',
        description: 'Годовая подписка AI Assistant Pro',
        status: 'succeeded',
        createdAt: '2024-02-15T14:20:00Z'
    },
    {
        id: '3',
        value: '499.00',
        description: 'Дополнительные запросы API',
        status: 'pending',
        createdAt: '2024-03-18T09:15:00Z'
    },
    {
        id: '4',
        value: '2999.00',
        description: 'Корпоративный тариф',
        status: 'failed',
        createdAt: '2024-03-10T16:45:00Z'
    },
    {
        id: '5',
        value: '999.00',
        description: 'Продление подписки',
        status: 'succeeded',
        createdAt: '2024-03-01T11:00:00Z'
    },
    {
        id: '6',
        value: '1499.00',
        description: 'Премиум поддержка',
        status: 'succeeded',
        createdAt: '2024-02-28T13:30:00Z'
    },
    {
        id: '7',
        value: '799.00',
        description: 'Месячная подписка AI Assistant Basic',
        status: 'succeeded',
        createdAt: '2024-03-15T09:20:00Z'
    },
    {
        id: '8',
        value: '2499.00',
        description: 'Командный тариф на 3 месяца',
        status: 'succeeded',
        createdAt: '2024-03-12T11:45:00Z'
    },
    {
        id: '9',
        value: '349.00',
        description: 'Дополнительные 1000 запросов',
        status: 'pending',
        createdAt: '2024-03-20T14:10:00Z'
    },
    {
        id: '10',
        value: '4999.00',
        description: 'Корпоративный тариф на год',
        status: 'succeeded',
        createdAt: '2024-03-05T16:30:00Z'
    },
    {
        id: '11',
        value: '1299.00',
        description: 'Расширенный доступ к GPT-4',
        status: 'succeeded',
        createdAt: '2024-03-17T10:15:00Z'
    },


];

// Моковый чек для демонстрации
const MOCK_RECEIPT: Receipt = {
    id: 'rcpt_1',
    type: 'payment',
    paymentId: '1',
    status: 'succeeded',
    amount: '999.00',
    fiscalDocumentNumber: '12345',
    fiscalStorageNumber: 'FS-987654321',
    fiscalAttribute: 'FA-1234567890',
    registeredAt: '2024-03-19T10:31:00Z',
    fiscalProviderId: 'yookassa',
    items: [
        {
            description: 'AI Assistant Pro - Месячная подписка',
            quantity: '1',
            amountValue: '999.00',
            amountCurrency: 'RUB',
            vatCode: 1
        }
    ],
    settlements: [
        {
            type: 'payment',
            amountValue: '999.00',
            amountCurrency: 'RUB'
        }
    ],
    sellerName: 'ООО "AI Assistant"'
};

const PaymentHistoryPage: React.FC = () => {
    const navigate = useNavigate();

    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [receipt, setReceipt] = useState<Receipt | null>(null);

    const itemsPerPage = 7;

    // Общее количество страниц на основе всех данных
    const totalPages = Math.ceil(MOCK_PAYMENTS.length / itemsPerPage);

    // Загрузка платежей при монтировании и при изменении страницы
    useEffect(() => {
        loadPayments(currentPage);
    }, [currentPage]);

    const loadPayments = (page: number) => {
        setIsLoading(true);

        // Имитация загрузки с сервера
        setTimeout(() => {
            const end = page * itemsPerPage;
            const newPayments = MOCK_PAYMENTS.slice(0, end);
            setPayments(newPayments);
            setIsLoading(false);
        }, 200);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSelectPayment = (payment: Payment) => {
        setSelectedPayment(payment);
        // Для демо показываем чек только для определенных платежей
        if (payment.id === '1' || payment.id === '2' || payment.id === '5') {
            setReceipt(MOCK_RECEIPT);
        } else {
            setReceipt(null);
        }
    };

    const handleCreateReceipt = () => {
        console.log('Создание чека для платежа:', selectedPayment?.id);
    };

    const handleClose = () => {
        navigate('/profile');
    };

    // Получаем текущую страницу платежей для отображения
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPayments = payments.slice(startIndex, endIndex);

    return (
        <div className="payment-history-page">
            <CloseButton onClose={handleClose} />

            <div className="payment-history-page__sidebar">
                {isLoading && payments.length === 0 ? (
                    <div className="payment-list__loading">Загрузка платежей...</div>
                ) : (
                    <>
                        <PaymentList
                            payments={currentPayments}
                            selectedId={selectedPayment?.id || null}
                            onSelect={handleSelectPayment}
                        />
                        {isLoading && payments.length > 0 && (
                            <div className="payment-list__loading-more">Загрузка...</div>
                        )}
                    </>
                )}

                <div className="payment-history-page__pagination">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages} // Используем общее количество страниц
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            <div className="payment-history-page__content">
                {selectedPayment ? (
                    <div className="payment-history-page__content-inner">
                        <PaymentDetails
                            payment={selectedPayment}
                            receipt={receipt}
                            onCreateReceipt={handleCreateReceipt}
                        />
                    </div>
                ) : (
                    <div className="payment-history-page__placeholder">
                        Выберите платеж из списка
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistoryPage;