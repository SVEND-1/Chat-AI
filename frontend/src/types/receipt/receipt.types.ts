// Зеркало PaymentResponse.java — добавлен Payment (его не хватало)
export interface Payment {
    id: string;
    value: string;
    description: string;
    status: string;
    createdAt: string;
}

// Зеркало ReceiptItem.java
export interface ReceiptItem {
    description: string;
    quantity: string;
    amountValue: string;
    amountCurrency: string;
    vatCode: number;
}

// Зеркало SettlementReceipt.java
export interface SettlementReceipt {
    type: string;
    amountValue: string;
    amountCurrency: string;
}

// Зеркало ReceiptResponse.java
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
