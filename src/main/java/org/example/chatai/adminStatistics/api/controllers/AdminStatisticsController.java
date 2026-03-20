package org.example.chatai.adminStatistics.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.adminStatistics.api.dto.requests.AdminStatsAllUsersFilter;
import org.example.chatai.adminStatistics.api.dto.responses.UsersAmountResponse;
import org.example.chatai.adminStatistics.domain.services.AdminStatisticsService;
import org.example.chatai.users.api.dto.users.response.UserDefaultResponse;
import org.example.chatai.users.db.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/admin-stats")
@RequiredArgsConstructor
@Slf4j
public class AdminStatisticsController {
    private final AdminStatisticsService adminStatisticsService;

    @GetMapping("/users-amount")
    public ResponseEntity<UsersAmountResponse> getUsersAmount(
            @RequestParam(name = "role", required = false) Role role
    ) {
        log.info("Called method: getUsersAmount with role {}", role);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(adminStatisticsService.getUsersAmountByFilter(role));
    }

    // Список всех людей с фильтром по ролям
    @GetMapping("/users")
    public ResponseEntity<List<UserDefaultResponse>> getAllUsers(
            @RequestParam(name = "pageSize", required = false) Integer pageSize,
            @RequestParam(name = "pageNumber", required = false) Integer pageNumber,
            @RequestParam(name = "role", required = false) Role role
    ) {
        log.info("Called method: getAllUsers with pageSize {} and pageNumber {} and role {}", pageSize, pageNumber, role);

        AdminStatsAllUsersFilter filter = new AdminStatsAllUsersFilter(
                pageSize,
                pageNumber,
                role
        );

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(adminStatisticsService.getAllUsersByFilter(filter));
    }

    // Поиск сотрудника поддержки по email
    @GetMapping("/support")
    public ResponseEntity<UserDefaultResponse> getSupportByEmail(
            @RequestParam("email") String email
    ) {
        log.info("Called method: getSupportByEmail with email {}", email);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(adminStatisticsService.getSupportByEmail(email));
    }

    // Количество активных подписок в %
}
