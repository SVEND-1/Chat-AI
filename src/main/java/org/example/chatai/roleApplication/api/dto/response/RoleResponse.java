package org.example.chatai.roleApplication.api.dto.response;

import org.example.chatai.roleApplication.db.StatusRole;
import org.example.chatai.users.api.dto.users.response.UserDefaultResponse;

import java.time.LocalDateTime;

public record RoleResponse(
        String messageUser,
        String answerAdmin,
        StatusRole statusRole,
        LocalDateTime createdAt,
        LocalDateTime answeredAt,
        UserDefaultResponse user
) {
}
