package org.example.chatai.supportTickets.api.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.chatai.supportTickets.api.dto.requests.SupportTicketCreateRequest;
import org.example.chatai.supportTickets.api.dto.responses.SupportStatusResponse;
import org.example.chatai.supportTickets.api.dto.responses.SupportTicketResponse;
import org.example.chatai.supportTickets.domain.services.SupportTicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Тикеты для обращения в поддержку")
@RestController
@RequestMapping("/api/support-ticket")
@RequiredArgsConstructor
@Slf4j
public class SupportTicketController {
    private final SupportTicketService supportTicketService;

    @Operation(summary = "Создать новый тикет обращения в поддержку (ТОЛЬКО USER!)")
    @PostMapping
    public ResponseEntity<SupportTicketResponse> createTicket(
            @RequestBody @Valid SupportTicketCreateRequest request
    ) {
        log.info("Called method: createTicket");

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(supportTicketService.createTicket(request));
    }

    @Operation(summary = "Показать все тикеты текущего пользователя")
    @GetMapping
    public ResponseEntity<List<SupportTicketResponse>> getAllTickets(
            @RequestParam(name = "pageSize", required = false) Integer pageSize,
            @RequestParam(name = "pageNum", required = false) Integer pageNum
    ) {
        log.info("Called method: getAllTickets with pageSize: {}, pageNum: {}", pageSize, pageNum);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportTicketService.getAllTicketsByUser(pageSize, pageNum));
    }

    @Operation(summary = "Получить тикет по id (ТОЛЬКО ПРИНАДЛЕЖАЩИЕ ТЕКУЩЕМУ ПОЛЬЗОВАТЕЛЮ!)")
    @GetMapping("/{id}")
    public ResponseEntity<SupportTicketResponse> getTicketById(
            @Parameter(description = "Id тикета")
            @PathVariable Long id
    ) {
        log.info("Called method: getTicketById with id: {}", id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportTicketService.getTicketById(id));
    }

    @Operation(summary = "Получить статус тикета")
    @GetMapping("/status/{id}")
    public ResponseEntity<SupportStatusResponse> getTicketStatusById(
            @Parameter(description = "Id тикета")
            @PathVariable Long id
    ) {
        log.info("Called method: getStatusById with id: {}", id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportTicketService.getTicketStatusById(id));
    }

    @Operation(summary = "Закрыть тикет(поставить статус CLOSED)")
    @PatchMapping("/{id}")
    public ResponseEntity<SupportTicketResponse> closeTicket(
            @Parameter(description = "Id тикета")
            @PathVariable("id") Long id
    ) {
        log.info("Called method: closeTicket with id: {}", id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(supportTicketService.closeTicket(id));
    }
}
