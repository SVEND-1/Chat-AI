import React from 'react';
import { usePaymentHistory } from './usePaymentHistory';
import PaymentList from '../../components/payment-history/PaymentList';
import PaymentDetails from '../../components/payment-history/paymentDetails/PaymentDetails';
import Pagination from '../../components/payment-history/pagination/Pagination';
import CloseButton from '../../components/subscription/subscription/CloseButton';
import '../../style/payment-history/PaymentHistoryPage.css';

const PaymentHistoryPage: React.FC = () => {
    const {
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
    } = usePaymentHistory();

    return (
        <div className="ph-page">
            <CloseButton onClose={handleClose} />

            {/* Левая панель */}
            <aside className="ph-sidebar">
                <div className="ph-sidebar__header">
                    <h1 className="ph-sidebar__title">История платежей</h1>
                    <button
                        className="ph-sidebar__pay-btn"
                        onClick={handleCreatePayment}
                        disabled={isCreatingPayment}
                    >
                        {isCreatingPayment ? 'Создание...' : '💳 Оформить подписку'}
                    </button>
                </div>

                <div className="ph-sidebar__list">
                    {isLoading && payments.length === 0 ? (
                        <div className="ph-sidebar__loading">
                            <div className="ph-spinner" />
                            <span>Загрузка...</span>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="ph-sidebar__empty">Платежей пока нет</div>
                    ) : (
                        <PaymentList
                            payments={payments}
                            selectedId={selectedPayment?.id ?? null}
                            onSelect={handleSelectPayment}
                        />
                    )}
                </div>

                <div className="ph-sidebar__pagination">
                    <Pagination
                        currentPage={currentPage + 1}
                        totalPages={totalPages}
                        onPageChange={(page) => handlePageChange(page - 1)}
                        isLoading={isLoading}
                    />
                </div>
            </aside>

            {/* Правая панель */}
            <main className="ph-main">
                {selectedPayment ? (
                    <PaymentDetails
                        payment={selectedPayment}
                        receipt={receipt}
                        onCreateReceipt={handleCreateReceipt}
                    />
                ) : (
                    <div className="ph-main__placeholder">
                        <div className="ph-main__placeholder-icon">🧾</div>
                        <p className="ph-main__placeholder-text">Выберите платёж из списка</p>
                        <p className="ph-main__placeholder-sub">Детали и чек появятся здесь</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PaymentHistoryPage;
