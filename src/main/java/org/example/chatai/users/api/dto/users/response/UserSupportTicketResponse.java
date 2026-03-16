package org.example.chatai.users.api.dto.users.response;

import org.example.chatai.users.db.Role;

public record UserSupportTicketResponse(
        Long id,
        String name,
        String email,
        Role role
) {
}
