package org.example.chatai.supportTickets.api.dto.responses;

import org.example.chatai.supportTickets.db.enums.SupportStatus;
import org.example.chatai.users.db.UserEntity;

import java.time.LocalDateTime;

public record SupportTicketResponse(
        Long id,
        UserEntity user,
        UserEntity support,
        String title,
        SupportStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime closedAt
) {
}
