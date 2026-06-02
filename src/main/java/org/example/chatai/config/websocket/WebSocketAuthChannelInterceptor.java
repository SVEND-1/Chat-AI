package org.example.chatai.config.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.config.JwtTokenProvider;
import org.example.chatai.users.api.dto.users.response.UserRegistrationResponse;
import org.example.chatai.users.domain.UserService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * Аутентификация при STOMP CONNECT.
 *
 * Порядок поиска токена:
 * 1. Заголовок Authorization: Bearer <token>   (внешние клиенты / тесты)
 * 2. Нативный STOMP-заголовок "token"          (браузер, когда cookie httpOnly)
 *
 * Браузерный фронт передаёт токен через connectHeaders: { token: "<jwt>" },
 * потому что httpOnly cookie недоступна из JS, но отдаётся сервером при
 * GET /ws/support/info — оттуда мы её не читаем. Вместо этого фронт
 * получает токен через отдельный REST-эндпоинт /api/auth/token и передаёт его.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null || accessor.getCommand() != StompCommand.CONNECT) {
            return message;
        }

        String token = extractToken(accessor);

        if (token == null) {
            log.warn("WS CONNECT rejected: no token found");
            throw new IllegalArgumentException("No auth token provided");
        }

        if (!jwtTokenProvider.isValidToken(token)) {
            log.warn("WS CONNECT rejected: invalid token");
            throw new IllegalArgumentException("Invalid JWT token");
        }

        String email = jwtTokenProvider.getEmailFromToken(token);
        UserRegistrationResponse user = userService.findUserByEmail(email);

        List<SimpleGrantedAuthority> authorities =
                Collections.singletonList(user.role().toAuthority());

        accessor.setUser(
                new UsernamePasswordAuthenticationToken(user, null, authorities)
        );
        log.debug("WS CONNECT authenticated: {}", email);

        return message;
    }

    private String extractToken(StompHeaderAccessor accessor) {
        // 1. Authorization: Bearer <token>
        String authHeader = accessor.getFirstNativeHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        // 2. Нативный STOMP-заголовок "token" — используется браузерным фронтом
        String tokenHeader = accessor.getFirstNativeHeader("token");
        if (tokenHeader != null && !tokenHeader.isBlank()) {
            return tokenHeader;
        }

        return null;
    }
}
