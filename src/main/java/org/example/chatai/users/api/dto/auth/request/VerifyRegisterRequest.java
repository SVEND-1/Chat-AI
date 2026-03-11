package org.example.chatai.users.api.dto.auth.request;

import jakarta.validation.constraints.NotNull;

public record VerifyRegisterRequest(
        @NotNull
        String registrationId,
        @NotNull
        String code
) {
}
