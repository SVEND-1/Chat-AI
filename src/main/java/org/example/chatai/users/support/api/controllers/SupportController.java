package org.example.chatai.users.support.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.users.support.api.dto.responses.SupportTicketResponse;
import org.example.chatai.users.support.domain.services.SupportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@Slf4j
public class SupportController {
    private final SupportService supportService;

    @GetMapping("/ticket")
    public ResponseEntity<List<SupportTicketResponse>> getAllTickets() {
        log.info("Called getAllTickets method");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportService.getAllTickets());
    }
}
