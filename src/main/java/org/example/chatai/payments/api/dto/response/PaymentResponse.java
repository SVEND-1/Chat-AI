package org.example.chatai.payments.api.dto.response;

public record PaymentResponse(
        String id,
        String value,
        String description,
        String status,
        String createdAt
) {
}
