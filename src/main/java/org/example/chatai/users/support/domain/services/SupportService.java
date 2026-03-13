package org.example.chatai.users.support.domain.services;

import lombok.RequiredArgsConstructor;
import org.example.chatai.users.support.api.dto.responses.SupportTicketResponse;
import org.example.chatai.users.support.db.entities.SupportTicketEntity;
import org.example.chatai.users.support.db.repositories.SupportMessageRepository;
import org.example.chatai.users.support.db.repositories.SupportTicketRepository;
import org.example.chatai.users.support.domain.mappers.SupportMessageMapper;
import org.example.chatai.users.support.domain.mappers.SupportTicketMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportService {
    private final SupportMessageRepository supportMessageRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final SupportTicketMapper supportTicketMapper;
    private final SupportMessageMapper supportMessageMapper;

    public List<SupportTicketResponse> getAllTickets() {
        List<SupportTicketEntity> supportTicketEntities = supportTicketRepository.findAll();

        return supportTicketEntities.stream()
                .map(supportTicketMapper::convertEntityToResponse)
                .toList();
    }
}
