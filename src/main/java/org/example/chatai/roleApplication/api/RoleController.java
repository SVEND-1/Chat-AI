package org.example.chatai.roleApplication.api;

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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")
@Slf4j
public class RoleController {
    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<String> created(@RequestBody RoleCreateRequest request) {
        return ResponseEntity.ok(roleService.save(request));
    }

    @PostMapping("/{id}")
    public ResponseEntity<RoleResponse> adminAnswer(
            @PathVariable("id") Long id,
            @RequestBody AdminAnswerRequest request
    ) {
        log.info("Called method: adminAnswer with id {} and request {}", id, request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(roleService.getAdminAnswer(id, request));
    }

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
                .body(roleService.getAllRolesWithFilter(filter));
    }

    @GetMapping("/user")
    public ResponseEntity<List<RoleResponse>> getUserRoles() {
        return ResponseEntity.ok(roleService.findAllByUser());
    }
}
