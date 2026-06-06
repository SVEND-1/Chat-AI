package org.example.chatai.users.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.chatai.users.api.dto.users.response.UserDefaultResponse;
import org.example.chatai.users.domain.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Пользователи")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "Получить информацию о текущем авторизованном пользователе")
    @GetMapping("/me")
    public ResponseEntity<UserDefaultResponse> getMe() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(userService.getCurrentUserForController());
    }
}
