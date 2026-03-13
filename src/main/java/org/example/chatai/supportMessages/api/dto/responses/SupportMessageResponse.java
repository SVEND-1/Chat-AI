package org.example.chatai.supportMessages.api.dto.responses;

import org.example.chatai.users.db.UserEntity;
import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.example.chatai.supportMessages.db.enums.SenderType;

import java.time.LocalDateTime;

public record SupportMessageResponse(
        Long id,
        SupportTicketEntity supportTicket,
        UserEntity sender,
        SenderType senderType,
        String message,
        LocalDateTime createdAt
) {
}
