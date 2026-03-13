package org.example.chatai.supportTickets.api.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record SupportTicketCreateRequest(
        @NotBlank(message = "Title shouldn't be blank")
        String title
) {
}
