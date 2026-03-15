package org.example.chatai.supportTickets.api.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.supportTickets.api.dto.requests.SupportTicketCreateRequest;
import org.example.chatai.supportTickets.api.dto.responses.SupportTicketResponse;
import org.example.chatai.supportTickets.domain.services.SupportTicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support-ticket")
@RequiredArgsConstructor
@Slf4j
public class SupportTicketController {
    private final SupportTicketService supportTicketService;

    @PostMapping
    public ResponseEntity<SupportTicketResponse> createTicket(
            @RequestBody @Valid SupportTicketCreateRequest request
    ) {
        log.info("Called method: createTicket");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(supportTicketService.createTicket(request));
    }

    @GetMapping
    public ResponseEntity<List<SupportTicketResponse>> getAllTickets(
            @RequestParam(name = "pageSize", required = false) int pageSize,
            @RequestParam(name = "pageNum", required = false) int pageNum
    ) {
        log.info("Called method: getAllTickets with pageSize: {}, pageNum: {}", pageSize, pageNum);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportTicketService.getAllTicketsByUser(pageSize, pageNum));
    }
}
