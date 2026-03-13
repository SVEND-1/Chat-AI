package org.example.chatai.supportTickets.api.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record SupportTicketCreateRequest(
        @NotBlank
        String title
) {
}
