package org.example.chatai.supportMessages.api.dto.responses;

import org.example.chatai.supportTickets.api.dto.responses.SupportTicketForSupportMessageResponse;
import org.example.chatai.users.api.dto.users.response.UserSupportTicketResponse;
import org.example.chatai.users.db.Role;

import java.time.LocalDateTime;

public record SupportMessageResponse(
        Long id,
        SupportTicketForSupportMessageResponse supportTicket,
        UserSupportTicketResponse sender,
        Role senderType,
        String message,
        LocalDateTime createdAt
) {
}
