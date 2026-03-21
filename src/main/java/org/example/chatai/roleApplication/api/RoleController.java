package org.example.chatai.roleApplication.api;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.example.chatai.roleApplication.api.dto.request.RoleCreateRequest;
import org.example.chatai.roleApplication.api.dto.response.RoleResponse;
import org.example.chatai.roleApplication.domain.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")
public class RoleController {
    private final RoleService roleService;

    @Operation(summary = "Получить все заявки пользователя на смену роли")
    @GetMapping
    public ResponseEntity<List<RoleResponse>> getRoles() {
        return ResponseEntity.ok(roleService.findAllByUser());
    }

    @Operation(summary = "Создать заявку на смену роли")
    @PostMapping
    public ResponseEntity<String> created(@RequestBody RoleCreateRequest request) {
        return ResponseEntity.ok(roleService.save(request));
    }
}
