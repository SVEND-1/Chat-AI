package org.example.chatai.supportMessages.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.supportMessages.db.entities.SupportMessageEntity;
import org.example.chatai.supportMessages.db.repositories.SupportMessageRepository;
import org.example.chatai.supportMessages.websocket.dto.WsErrorMessage;
import org.example.chatai.supportMessages.websocket.dto.WsIncomingMessage;
import org.example.chatai.supportMessages.websocket.dto.WsOutgoingMessage;
import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.example.chatai.supportTickets.db.enums.SupportStatus;
import org.example.chatai.supportTickets.db.repositories.SupportTicketRepository;
import org.example.chatai.users.db.UserEntity;
import org.example.chatai.users.db.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * WebSocket-хэндлер для чата поддержки.
 *
 * URL: /ws/support/{ticketId}?token=<JWT>
 *
 * Поведение:
 *  - При подключении проверяет, что пользователь является участником тикета
 *    (либо user, либо support сотрудник, назначенный на тикет).
 *  - При получении сообщения сохраняет его в БД и рассылает всем участникам тикета.
 *  - При закрытии сессии убирает её из списка активных.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SupportChatWebSocketHandler extends TextWebSocketHandler {

    private final SupportTicketRepository supportTicketRepository;
    private final SupportMessageRepository supportMessageRepository;
    private final UserRepository userRepository;

    /**
     * ticketId -> множество активных WebSocket-сессий для этого тикета.
     * CopyOnWriteArraySet безопасен при итерации + записи из разных потоков.
     */
    private final Map<Long, Set<WebSocketSession>> ticketSessions = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    // ============================= LIFECYCLE =============================

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long ticketId = extractTicketId(session);
        String userEmail = (String) session.getAttributes().get("userEmail");

        log.info("WS connection established: ticketId={}, user={}", ticketId, userEmail);

        SupportTicketEntity ticket = supportTicketRepository.findById(ticketId)
                .orElse(null);

        if (ticket == null) {
            sendError(session, "Тикет не найден");
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        UserEntity user = userRepository.findByEmailEqualsIgnoreCase(userEmail);
        if (user == null) {
            sendError(session, "Пользователь не найден");
            session.close(CloseStatus.SERVER_ERROR);
            return;
        }

        // Проверяем, что пользователь — участник тикета
        boolean isParticipant =
                ticket.getUser().getId().equals(user.getId()) ||
                ticket.getSupport().getId().equals(user.getId());

        if (!isParticipant) {
            sendError(session, "Нет доступа к этому тикету");
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }

        // Регистрируем сессию
        ticketSessions
                .computeIfAbsent(ticketId, id -> new CopyOnWriteArraySet<>())
                .add(session);

        // Сохраняем удобные атрибуты для последующих вызовов
        session.getAttributes().put("ticketId", ticketId);
        session.getAttributes().put("userId", user.getId());

        log.debug("WS session registered for ticketId={}, active sessions={}",
                ticketId, ticketSessions.get(ticketId).size());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Long ticketId = (Long) session.getAttributes().get("ticketId");
        if (ticketId != null) {
            Set<WebSocketSession> sessions = ticketSessions.get(ticketId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    ticketSessions.remove(ticketId);
                }
            }
        }
        log.info("WS connection closed: ticketId={}, status={}", ticketId, status);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.error("WS transport error for session {}: {}", session.getId(), exception.getMessage());
    }

    // ============================= MESSAGE HANDLING =============================

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws Exception {
        Long ticketId = (Long) session.getAttributes().get("ticketId");
        Long userId = (Long) session.getAttributes().get("userId");

        if (ticketId == null || userId == null) {
            sendError(session, "Сессия не инициализирована");
            return;
        }

        // Парсим входящее сообщение
        WsIncomingMessage incoming;
        try {
            incoming = objectMapper.readValue(textMessage.getPayload(), WsIncomingMessage.class);
        } catch (Exception e) {
            sendError(session, "Неверный формат сообщения. Ожидается JSON: {\"message\": \"текст\"}");
            return;
        }

        if (incoming.message() == null || incoming.message().isBlank()) {
            sendError(session, "Сообщение не может быть пустым");
            return;
        }

        SupportTicketEntity ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Тикет не найден"));

        if (ticket.getStatus() == SupportStatus.CLOSED) {
            sendError(session, "Тикет закрыт, отправка сообщений невозможна");
            return;
        }

        UserEntity sender = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь не найден"));

        // Сохраняем сообщение в БД
        SupportMessageEntity savedMessage = supportMessageRepository.save(
                SupportMessageEntity.builder()
                        .supportTicket(ticket)
                        .sender(sender)
                        .senderType(sender.getRole())
                        .message(incoming.message())
                        .build()
        );

        log.debug("Saved WS message id={} for ticketId={}", savedMessage.getId(), ticketId);

        // Формируем ответ и рассылаем всем участникам тикета
        WsOutgoingMessage outgoing = new WsOutgoingMessage(
                savedMessage.getId(),
                ticketId,
                sender.getId(),
                sender.getEmail(),
                sender.getRole(),
                savedMessage.getMessage(),
                savedMessage.getCreatedAt()
        );

        broadcastToTicket(ticketId, outgoing);
    }

    // ============================= HELPERS =============================

    /**
     * Рассылает сообщение всем активным сессиям тикета.
     */
    private void broadcastToTicket(Long ticketId, Object payload) {
        Set<WebSocketSession> sessions = ticketSessions.get(ticketId);
        if (sessions == null || sessions.isEmpty()) {
            return;
        }

        String json;
        try {
            json = objectMapper.writeValueAsString(payload);
        } catch (Exception e) {
            log.error("Failed to serialize WS message", e);
            return;
        }

        TextMessage message = new TextMessage(json);
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                try {
                    synchronized (s) {
                        s.sendMessage(message);
                    }
                } catch (IOException e) {
                    log.warn("Failed to send WS message to session {}: {}", s.getId(), e.getMessage());
                }
            }
        }
    }

    /**
     * Отправляет сообщение об ошибке конкретной сессии.
     */
    private void sendError(WebSocketSession session, String errorText) {
        try {
            String json = objectMapper.writeValueAsString(WsErrorMessage.of(errorText));
            synchronized (session) {
                session.sendMessage(new TextMessage(json));
            }
        } catch (IOException e) {
            log.error("Failed to send error to session {}: {}", session.getId(), e.getMessage());
        }
    }

    /**
     * Извлекает ticketId из пути /ws/support/{ticketId}.
     */
    private Long extractTicketId(WebSocketSession session) {
        String path = session.getUri().getPath();
        String[] parts = path.split("/");
        try {
            return Long.parseLong(parts[parts.length - 1]);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Некорректный ticketId в URL: " + path);
        }
    }
}
