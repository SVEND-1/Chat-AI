package org.example.chatai.globalException;

import java.time.LocalDateTime;

public record ErrorResponse(
        String message,
        String detailedMessage,
        LocalDateTime errorTime
) {
}
