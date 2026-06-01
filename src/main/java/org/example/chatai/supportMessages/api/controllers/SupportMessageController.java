package org.example.chatai.supportMessages.api.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.supportMessages.api.dto.requests.SupportMessageCreateRequest;
import org.example.chatai.supportMessages.api.dto.responses.SupportMessageResponse;
import org.example.chatai.supportMessages.domain.services.SupportMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Сообщения для тикетов обращения в поддержку")
@RestController
@RequestMapping("/api/support-message")
@RequiredArgsConstructor
@Slf4j
public class SupportMessageController {
    private final SupportMessageService supportMessageService;

    @Operation(summary = "Отправить(создать) новое сообщение")
    @PostMapping("/{support_ticket_id}")
    public ResponseEntity<SupportMessageResponse> createMessage(
            @Parameter(description = "Id тикета обращения в поддержку к которому будет присваиваться созданное сообщение")
            @PathVariable("support_ticket_id") Long supportTicketId,
            @RequestBody @Valid SupportMessageCreateRequest request
    ) {
        log.info("Calling method: createMessage with support_ticket_id {} and request {}", supportTicketId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(supportMessageService.createMessage(supportTicketId, request));
    }

    @Operation(summary = "Получить все сообщения из тикета")
    @GetMapping("/{support_ticket_id}")
    public ResponseEntity<List<SupportMessageResponse>> getAllMessagesFromTicket(
            @Parameter(description = "Id тикета из которого будут браться сообщения")
            @PathVariable("support_ticket_id") Long supportTicketId
    ) {
        log.info("Called method: getAllMessagesFromTicket with support_ticket_id {}", supportTicketId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportMessageService.getAllMessagesFromTicket(supportTicketId));
    }

    @Operation(summary = "Получить последнее сообщение из тикета")
    @GetMapping("/last-message/{support_ticket_id}")
    public ResponseEntity<SupportMessageResponse> getLastMessageFromTicket(
            @Parameter(description = "Id тикета для получения из него последнего сообщения")
            @PathVariable("support_ticket_id") Long supportTicketId
    ) {
        log.info("Called method: getLastMessageFromTicket with support_ticket_id {}", supportTicketId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportMessageService.getLastMessageFromTicket(supportTicketId));
    }

    @Operation(summary = "Получить все сообщения пользователя из тикета")
    @GetMapping("/user/{support_ticket_id}")
    public ResponseEntity<List<SupportMessageResponse>> getAllUserMessagesFromTicket(
            @Parameter(description = "Id тикета для получения из него всех сообщений пользователя")
            @PathVariable("support_ticket_id") Long supportTicketId) {
        log.info("Called method: getAllUserMessagesFromTicket with id {}", supportTicketId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportMessageService.getAllUserMessagesFromTicket(supportTicketId));
    }

    @Operation(summary = "Получить все сообщения сотрудника поддержки из тикета")
    @GetMapping("/support/{support_ticket_id}")
    public ResponseEntity<List<SupportMessageResponse>> getAllSupportMessagesFromTicket(
            @Parameter(description = "Id тикета для получения из него всех сообщений сотрудника поддержки")
            @PathVariable("support_ticket_id") Long supportTicketId) {
        log.info("Called method: getAllSupportMessagesFromTicket with id {}", supportTicketId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportMessageService.getAllSupportMessagesFromTicket(supportTicketId));
    }
}
