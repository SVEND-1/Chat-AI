package org.example.chatai.config.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.config.JwtTokenProvider;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * Перехватчик WebSocket-хэндшейка.
 * Извлекает JWT из:
 *   1. Query-параметра ?token=...  (удобно для фронта)
 *   2. Заголовка Authorization: Bearer ...
 *
 * При успехе кладёт email пользователя в атрибуты сессии под ключом "userEmail".
 * При неудаче — отклоняет соединение (возвращает false).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        String token = extractToken(request);

        if (token == null || !jwtTokenProvider.isValidToken(token)) {
            log.warn("WebSocket handshake rejected: invalid or missing JWT");
            return false;
        }

        String email = jwtTokenProvider.getEmailFromToken(token);
        attributes.put("userEmail", email);
        log.debug("WebSocket handshake accepted for user: {}", email);
        return true;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        // ничего делать не нужно
    }

    private String extractToken(ServerHttpRequest request) {
        // 1. Попробуем query-параметр: ws://host/ws/support/1?token=eyJ...
        String query = request.getURI().getQuery();
        if (query != null) {
            for (String param : query.split("&")) {
                if (param.startsWith("token=")) {
                    return param.substring("token=".length());
                }
            }
        }

        // 2. Попробуем заголовок Authorization: Bearer <token>
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        return null;
    }
}
