package org.example.chatai.users.support.api.dto.responses;

import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.support.db.enums.SupportStatus;

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
