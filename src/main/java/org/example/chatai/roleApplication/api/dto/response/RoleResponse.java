package org.example.chatai.roleApplication.api.dto.response;

import org.example.chatai.roleApplication.db.StatusRole;

import java.time.LocalDateTime;

public record RoleResponse(
        String messageUser,
        String answerAdmin,
        StatusRole statusRole,
        LocalDateTime createdTime,
        LocalDateTime answerTime
) {
}
