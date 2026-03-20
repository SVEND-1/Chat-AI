package org.example.chatai.roleApplication.api.dto.request;

import org.example.chatai.roleApplication.db.StatusRole;

public record RoleApplicationSearchFilter(
        Integer pageSize,
        Integer pageNumber,
        StatusRole statusRole
) {
}
