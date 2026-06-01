package org.example.chatai.chat.api.dto.response;

public record GlobalStats(
        long responseTimeSum,
        int responseCount
) {
}
