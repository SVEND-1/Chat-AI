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
        log.info("Creating support message for support_ticket_id {} and request {}", supportTicketId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(supportMessageService.createMessage(supportTicketId, request));
    }
}
