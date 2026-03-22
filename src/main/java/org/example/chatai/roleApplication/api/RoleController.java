package org.example.chatai.roleApplication.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.roleApplication.api.dto.request.AdminAnswerRequest;
import org.example.chatai.roleApplication.api.dto.request.RoleApplicationSearchFilter;
import org.example.chatai.roleApplication.api.dto.request.RoleCreateRequest;
import org.example.chatai.roleApplication.api.dto.response.RoleResponse;
import org.example.chatai.roleApplication.db.StatusRole;
import org.example.chatai.roleApplication.domain.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Заявки на роль SUPPORT")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")
@Slf4j
public class RoleController {
    private final RoleService roleService;

    @Operation(summary = "Получить все заявки пользователя на смену роли")
    @GetMapping("/user")
    public ResponseEntity<List<RoleResponse>> getRolesForCurrentUser() {
        return ResponseEntity.ok(roleService.findAllByUser());
    }

    @Operation(summary = "Создать заявку на смену роли")
    @PostMapping
    public ResponseEntity<String> created(@RequestBody RoleCreateRequest request) {
        return ResponseEntity.ok(roleService.save(request));
    }

    @Operation(summary = "Ответить на заявку на получение должности SUPPORT (только для ADMIN!)")
    @PostMapping("/{id}")
    public ResponseEntity<RoleResponse> adminAnswer(
            @Parameter(description = "Id заявки в статусе WAITING на должность SUPPORT")
            @PathVariable("id") Long id,
            @RequestBody AdminAnswerRequest request
    ) {
        log.info("Called method: adminAnswer with id {} and request {}", id, request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(roleService.getAdminAnswer(id, request));
    }

    @Operation(summary = "Получить все заявки с фильтром по их статусу (только для ADMIN!)")
    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAllRolesWithFilter(
            @RequestParam(name = "page-size", required = false) Integer pageSize,
            @RequestParam(name = "page-number", required = false) Integer pageNumber,
            @RequestParam(name = "status-role", required = false) StatusRole statusRole
    ) {
        log.info("Called method: getAllRolesWithFilter with pageSize {} and pageNumber {} and statusRole {}", pageSize, pageNumber, statusRole);

        RoleApplicationSearchFilter filter = new RoleApplicationSearchFilter(
                pageSize,
                pageNumber,
                statusRole
        );
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(roleService.getAllRoleApplicationsWithFilter(filter));
    }
}
