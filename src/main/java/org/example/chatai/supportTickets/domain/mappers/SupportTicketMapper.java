package org.example.chatai.supportTickets.domain.mappers;

import org.example.chatai.supportTickets.api.dto.responses.SupportTicketResponse;
import org.example.chatai.supportTickets.db.entities.SupportTicketEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SupportTicketMapper {
    SupportTicketResponse convertEntityToResponse(SupportTicketEntity entity);
    List<SupportTicketResponse> convertEntityListToResponseList(List<SupportTicketEntity> supportTicketEntities);
}
