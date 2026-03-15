package org.example.chatai.supportTickets.domain.mappers;

import org.example.chatai.supportTickets.api.dto.responses.SupportTicketResponse;
import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SupportTicketMapper {
    SupportTicketResponse convertEntityToResponse(SupportTicketEntity entity);
}
