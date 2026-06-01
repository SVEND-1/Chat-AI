package org.example.chatai.supportTickets.api.dto.responses;

import org.example.chatai.supportTickets.db.enums.SupportStatus;

public record SupportStatusResponse(
        SupportStatus status
) {
}
