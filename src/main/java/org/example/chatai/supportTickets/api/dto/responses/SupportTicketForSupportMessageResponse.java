package org.example.chatai.supportTickets.api.dto.responses;

import org.example.chatai.supportTickets.db.enums.SupportStatus;
import org.example.chatai.users.api.dto.users.response.UserDefaultResponse;

public record SupportTicketForSupportMessageResponse(
        Long id,
        UserDefaultResponse user,
        UserDefaultResponse support,
        String title,
        SupportStatus status
) {
}
