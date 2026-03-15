package org.example.chatai.payments.api.dto.response.receipt;

public record SettlementReceipt(
        String type,
        String amountValue,
        String amountCurrency
) {}