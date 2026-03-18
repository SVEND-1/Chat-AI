package org.example.chatai.chat.api.dto.response;

import java.util.List;

public record ChatAIResponse(
    String title,
    List<ChatAIMessage> message
) {
}
