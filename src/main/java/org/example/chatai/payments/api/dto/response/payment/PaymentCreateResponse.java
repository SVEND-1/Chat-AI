package org.example.chatai.payments.api.dto.response.payment;

public record PaymentCreateResponse(
        String paymentId,
        String urlPay
) {
}
