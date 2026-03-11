package org.example.chatai.users.api.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterCodeRequest(
        @Email
        @NotNull
        String email,
        @NotNull
        @Size(min = 6, max = 50)
        String password,
        @NotNull
        String name
) {
}
