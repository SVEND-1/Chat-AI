package org.example.chatai.users.support.api.dto.responses;

import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.support.db.entities.SupportTicketEntity;
import org.example.chatai.users.support.db.enums.SenderType;

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
