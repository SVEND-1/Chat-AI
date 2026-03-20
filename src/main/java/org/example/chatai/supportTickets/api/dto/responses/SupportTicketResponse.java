package org.example.chatai.supportTickets.api.dto.responses;

import org.example.chatai.supportTickets.db.enums.SupportStatus;
import org.example.chatai.users.api.dto.users.response.UserDefaultResponse;

import java.time.LocalDateTime;

public record SupportTicketResponse(
        Long id,
        UserDefaultResponse user,
        UserDefaultResponse support,
        String title,
        SupportStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime closedAt
) {
}
