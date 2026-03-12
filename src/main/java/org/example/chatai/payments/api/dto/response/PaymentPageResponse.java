package org.example.chatai.payments.api.dto.response;

import java.util.List;

public record PaymentPageResponse(
        List<PaymentResponse> content,
        int number,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        boolean empty
) {
}
