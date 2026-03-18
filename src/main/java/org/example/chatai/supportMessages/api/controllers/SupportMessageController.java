package org.example.chatai.supportMessages.api.controllers;

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

@RestController
@RequestMapping("/api/support-message")
@RequiredArgsConstructor
@Slf4j
public class SupportMessageController {
    private final SupportMessageService supportMessageService;

    @PostMapping("/{support_ticket_id}")
    public ResponseEntity<SupportMessageResponse> createMessage(
            @PathVariable("support_ticket_id") Long supportTicketId,
            @RequestBody @Valid SupportMessageCreateRequest request
    ) {
        log.info("Calling method: createMessage with support_ticket_id {} and request {}", supportTicketId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(supportMessageService.createMessage(supportTicketId, request));
    }

    @GetMapping("/{support_ticket_id}")
    public ResponseEntity<List<SupportMessageResponse>> getAllMessagesFromTicket(
            @PathVariable("support_ticket_id") Long supportTicketId
    ) {
        log.info("Called method: getAllMessagesFromTicket with support_ticket_id {}", supportTicketId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportMessageService.getAllMessagesFromTicket(supportTicketId));
    }

    @GetMapping("/last-message/{support_ticket_id}")
    public ResponseEntity<SupportMessageResponse> getLastMessageFromTicket(
            @PathVariable("support_ticket_id") Long supportTicketId
    ) {
        log.info("Called method: getLastMessageFromTicket with support_ticket_id {}", supportTicketId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportMessageService.getLastMessageFromTicket(supportTicketId));
    }

    @GetMapping("/user/{support_ticket_id}")
    public ResponseEntity<List<SupportMessageResponse>> getAllUserMessagesFromTicket(
            @PathVariable("support_ticket_id") Long supportTicketId) {
        log.info("Called method: getAllUserMessagesFromTicket with id {}", supportTicketId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportMessageService.getAllUserMessagesFromTicket(supportTicketId));
    }

    @GetMapping("/support/{support_ticket_id}")
    public ResponseEntity<List<SupportMessageResponse>> getAllSupportMessagesFromTicket(
            @PathVariable("support_ticket_id") Long supportTicketId) {
        log.info("Called method: getAllSupportMessagesFromTicket with id {}", supportTicketId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportMessageService.getAllSupportMessagesFromTicket(supportTicketId));
    }
}
