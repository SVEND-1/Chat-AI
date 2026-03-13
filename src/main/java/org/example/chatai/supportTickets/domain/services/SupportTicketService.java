package org.example.chatai.supportTickets.domain.services;

import lombok.RequiredArgsConstructor;
import org.example.chatai.supportTickets.api.dto.responses.SupportTicketResponse;
import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.example.chatai.supportMessages.db.repositories.SupportMessageRepository;
import org.example.chatai.supportTickets.db.repositories.SupportTicketRepository;
import org.example.chatai.supportMessages.domain.mappers.SupportMessageMapper;
import org.example.chatai.supportTickets.domain.mappers.SupportTicketMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportTicketService {
    private final SupportTicketRepository supportTicketRepository;
    private final SupportTicketMapper supportTicketMapper;

    public List<SupportTicketResponse> getAllTickets() {
        List<SupportTicketEntity> supportTicketEntities = supportTicketRepository.findAll();

        return supportTicketEntities.stream()
                .map(supportTicketMapper::convertEntityToResponse)
                .toList();
    }
}
