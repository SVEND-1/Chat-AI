package org.example.chatai.supportTickets.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.supportTickets.api.dto.responses.SupportTicketResponse;
import org.example.chatai.supportTickets.domain.services.SupportTicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/support-ticket")
@RequiredArgsConstructor
@Slf4j
public class SupportTicketController {
    private final SupportTicketService supportTicketService;

    @PostMapping

    @GetMapping
    public ResponseEntity<List<SupportTicketResponse>> getAllTickets() {
        log.info("Called getAllTickets method");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportTicketService.getAllTickets());
    }
}
