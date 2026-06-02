package org.example.chatai.users.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.chatai.config.JwtTokenProvider;
import org.example.chatai.users.api.dto.auth.request.LoginRequest;
import org.example.chatai.users.api.dto.auth.request.RegisterCodeRequest;
import org.example.chatai.users.api.dto.auth.request.ResetPasswordRequest;
import org.example.chatai.users.api.dto.auth.request.VerifyRegisterRequest;
import org.example.chatai.users.domain.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Управление авторизацией")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "Вход в систему существующего пользователя")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest loginRequest,
                                   HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(loginRequest, response));
    }

    @Operation(summary = "Выход с системы")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        return ResponseEntity.ok(authService.logout(response));
    }

    @Operation(summary = "Заполения полей для регистации и отправка кода")
    @PostMapping("/register/send-code")
    public ResponseEntity<?> sendRegistrationCode(@RequestBody @Valid RegisterCodeRequest request) {
        return ResponseEntity.ok(authService.sendRegistrationCode(request));
    }

    @Operation(summary = "Подтверждение регистрации и создания пользователя")
    @PostMapping("/register/verify")
    public ResponseEntity<?> verifyRegistration(
            @RequestBody @Valid VerifyRegisterRequest request,
            HttpServletResponse response) {
        return ResponseEntity.ok(authService.verifyRegistration(request, response));
    }

    @Operation(summary = "Повторная отправка кода")
    @PostMapping("/register/resend-code")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String registrationId) {
        return ResponseEntity.ok(authService.resendVerificationCode(registrationId));
    }

    @Operation(summary = "Заполнения email пользователя который забыл пароль и отправка кода")
    @PostMapping("/password/forgot")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        return ResponseEntity.ok(authService.forgotPassword(email));
    }

    @Operation(summary = "Подтверждение кода")
    @PostMapping("/password/verify")
    public ResponseEntity<?> verifyResetCode(
            @RequestParam String resetId,
            @RequestParam String code) {
        return ResponseEntity.ok(authService.verifyResetCode(resetId, code));
    }

    @Operation(summary = "Смена пароля пользователя")
    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPassword(
            @RequestBody @Valid ResetPasswordRequest request,
            HttpServletResponse response) {
        return ResponseEntity.ok(authService.resetPassword(request, response));
    }

    @Operation(summary = "Получить текущий JWT токен из cookie (для WebSocket-подключения)")
    @GetMapping("/token")
    public ResponseEntity<?> getToken(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwtToken".equals(cookie.getName())) {
                    String email = jwtTokenProvider.getEmailFromToken(cookie.getValue());
                    return ResponseEntity.ok(Map.of("token", cookie.getValue(), "email", email));
                }
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }
}

