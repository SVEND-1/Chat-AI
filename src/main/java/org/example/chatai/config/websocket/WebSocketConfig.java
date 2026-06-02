package org.example.chatai.config.websocket;

import lombok.RequiredArgsConstructor;
import org.example.chatai.supportMessages.websocket.SupportChatWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final SupportChatWebSocketHandler supportChatWebSocketHandler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(supportChatWebSocketHandler, "/ws/support/{ticketId}")
                .addInterceptors(jwtHandshakeInterceptor)
                // Разрешаем те же origins, что и в CORS
                .setAllowedOriginPatterns("*");
    }
}
