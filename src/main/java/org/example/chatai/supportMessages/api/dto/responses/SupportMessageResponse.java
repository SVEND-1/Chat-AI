package org.example.chatai.supportMessages.api.dto.responses;

import org.example.chatai.supportTickets.api.dto.responses.SupportTicketForSupportMessageResponse;
import org.example.chatai.users.api.dto.users.response.UserDefaultResponse;
import org.example.chatai.users.db.Role;

import java.time.LocalDateTime;

public record SupportMessageResponse(
        Long id,
        SupportTicketForSupportMessageResponse supportTicket,
        UserDefaultResponse sender,
        Role senderType,
        String message,
        LocalDateTime createdAt
) {
}
