package org.example.chatai.chat.api.dto.response;

import org.springframework.ai.chat.messages.MessageType;

public record ChatAIMessage(
        String message,
        MessageType type
) {
}
