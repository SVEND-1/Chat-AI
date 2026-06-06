package org.example.chatai.adminStatistics.api.dto.requests;

import org.example.chatai.users.db.Role;

public record AdminStatsAllUsersFilter(
        Integer pageSize,
        Integer pageNumber,
        Role role
) {
}
