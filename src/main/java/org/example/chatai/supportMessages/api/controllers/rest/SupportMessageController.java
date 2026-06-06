package org.example.chatai.supportMessages.api.controllers.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.supportMessages.api.dto.responses.SupportMessageResponse;
import org.example.chatai.supportMessages.domain.services.SupportMessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-контроллер для чтения истории сообщений.
 *
 * Отправка новых сообщений перенесена в WebSocket:
 *   STOMP endpoint: /ws/support
 *   Отправить: /app/support/{ticketId}/send
 *   Слушать:   /topic/support/{ticketId}
 */
@Tag(name = "Сообщения для тикетов обращения в поддержку")
@RestController
@RequestMapping("/api/support-message")
@RequiredArgsConstructor
@Slf4j
public class SupportMessageController {

    private final SupportMessageService supportMessageService;

    @Operation(summary = "Получить всю историю сообщений из тикета (используется при открытии чата)")
    @GetMapping("/{support_ticket_id}")
    public ResponseEntity<List<SupportMessageResponse>> getAllMessagesFromTicket(
            @Parameter(description = "Id тикета")
            @PathVariable("support_ticket_id") Long supportTicketId
    ) {
        log.info("Called method: getAllMessagesFromTicket with support_ticket_id {}", supportTicketId);
        return ResponseEntity.ok(supportMessageService.getAllMessagesFromTicket(supportTicketId));
    }

    @Operation(summary = "Получить последнее сообщение из тикета")
    @GetMapping("/last-message/{support_ticket_id}")
    public ResponseEntity<SupportMessageResponse> getLastMessageFromTicket(
            @Parameter(description = "Id тикета")
            @PathVariable("support_ticket_id") Long supportTicketId
    ) {
        log.info("Called method: getLastMessageFromTicket with support_ticket_id {}", supportTicketId);
        return ResponseEntity.ok(supportMessageService.getLastMessageFromTicket(supportTicketId));
    }
}