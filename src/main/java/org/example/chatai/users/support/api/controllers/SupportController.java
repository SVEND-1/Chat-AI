package org.example.chatai.users.support.api.controllers;

import lombok.RequiredArgsConstructor;
import org.example.chatai.users.support.domain.SupportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {
    private final SupportService supportService;

    @GetMapping
    public ResponseEntity<>
}
