package org.example.chatai.payments.api.dto.response;

public record PaymentCreateResponse(
        String paymentId,
        String urlPay
) {
}
