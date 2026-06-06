package org.example.chatai.supportMessages.api.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record SupportMessageCreateRequest(
        @NotBlank(message = "Message shouldn't be blank")
        String message
) {
}
