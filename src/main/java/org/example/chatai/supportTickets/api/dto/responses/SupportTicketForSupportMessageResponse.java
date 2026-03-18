package org.example.chatai.supportTickets.api.dto.responses;

import org.example.chatai.supportTickets.db.enums.SupportStatus;
import org.example.chatai.users.api.dto.users.response.UserSupportTicketResponse;

public record SupportTicketForSupportMessageResponse(
        Long id,
        UserSupportTicketResponse user,
        UserSupportTicketResponse support,
        String title,
        SupportStatus status
) {
}
