package org.example.chatai.roleApplication.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.roleApplication.api.dto.request.AdminAnswerRequest;
import org.example.chatai.roleApplication.api.dto.request.RoleCreateRequest;
import org.example.chatai.roleApplication.api.dto.response.RoleResponse;
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
    public ResponseEntity<List<RoleResponse>> getRoles() {
        return ResponseEntity.ok(roleService.findAllByUser());
    }


}
