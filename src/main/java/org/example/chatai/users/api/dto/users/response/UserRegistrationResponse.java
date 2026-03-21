package org.example.chatai.users.api.dto.users.response;


import org.example.chatai.users.db.Role;

public record UserRegistrationResponse(
        Long id,
        String name,
        String email,
        String password,
        Role role
) {
}
