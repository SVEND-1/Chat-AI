package org.example.chatai.supportMessages.api.controllers.websocket;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.supportMessages.api.dto.requests.SupportMessageCreateRequest;
import org.example.chatai.supportMessages.api.dto.responses.SupportMessageResponse;
import org.example.chatai.supportMessages.domain.services.SupportMessageService;
import org.example.chatai.supportTickets.api.dto.responses.SupportTicketResponse;
import org.example.chatai.supportTickets.domain.services.SupportTicketService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * WebSocket-контроллер чата поддержки (STOMP).
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │ Клиент подключается к SockJS endpoint: /ws/support       │
 * │                                                         │
 * │ ОТПРАВИТЬ сообщение → /app/support/{ticketId}/send      │
 * │ ЗАКРЫТЬ тикет       → /app/support/{ticketId}/close     │
 * │                                                         │
 * │ СЛУШАТЬ сообщения   ← /topic/support/{ticketId}         │
 * │ СЛУШАТЬ статус      ← /topic/support/{ticketId}/status  │
 * └─────────────────────────────────────────────────────────┘
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class SupportChatWebSocketController {

    private final SupportMessageService supportMessageService;
    private final SupportTicketService supportTicketService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Принимает новое сообщение и рассылает его всем участникам тикета.
     *
     * Клиент шлёт:    /app/support/{ticketId}/send  { "message": "текст" }
     * Все получают:   /topic/support/{ticketId}     → SupportMessageResponse
     */
    @MessageMapping("/support/{ticketId}/send")
    public void sendMessage(
            @DestinationVariable Long ticketId,
            @Payload @Valid SupportMessageCreateRequest request,
            Principal principal
    ) {
        log.info("WS: incoming message in ticket={} from={}", ticketId, principal.getName());

        SupportMessageResponse response =
                supportMessageService.createMessage(ticketId, request, principal);

        messagingTemplate.convertAndSend("/topic/support/" + ticketId, response);
        log.debug("WS: broadcast to /topic/support/{}", ticketId);
    }

    /**
     * Закрывает тикет и уведомляет всех участников об изменении статуса.
     *
     * Клиент шлёт:    /app/support/{ticketId}/close   (тело пустое)
     * Все получают:   /topic/support/{ticketId}/status → SupportTicketResponse (status=CLOSED)
     */
    @MessageMapping("/support/{ticketId}/close")
    public void closeTicket(
            @DestinationVariable Long ticketId,
            Principal principal
    ) {
        log.info("WS: closing ticket={} by={}", ticketId, principal.getName());

        SupportTicketResponse response = supportTicketService.closeTicket(ticketId);
        messagingTemplate.convertAndSend("/topic/support/" + ticketId + "/status", response);
        log.debug("WS: ticket {} closed, status broadcast sent", ticketId);
    }
}
