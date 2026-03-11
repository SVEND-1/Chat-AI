package org.example.chatai.users.api.dto.users.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.example.chatai.users.db.Role;

public record UserCreateRequest(
        @NotNull
        String name,
        @NotNull
        @Email
        String email,
        @NotNull
        String password,
        @NotNull
        @Enumerated(EnumType.STRING)
        Role role
) {
}
