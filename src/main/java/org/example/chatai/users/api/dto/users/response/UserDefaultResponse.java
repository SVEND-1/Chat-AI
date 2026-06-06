package org.example.chatai.users.api.dto.users.response;

import org.example.chatai.users.db.Role;

public record UserDefaultResponse(
        Long id,
        String name,
        String email,
        Role role
) {
}
