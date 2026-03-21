package org.example.chatai.roleApplication.api.dto.request;

import org.example.chatai.roleApplication.db.StatusRole;

public record AdminAnswerRequest(
        String answerAdmin,
        StatusRole statusRole
) {
}
