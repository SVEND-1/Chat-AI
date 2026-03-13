package org.example.chatai.users.support.domain.mappers;

import org.example.chatai.users.support.api.dto.responses.SupportTicketResponse;
import org.example.chatai.users.support.db.entities.SupportTicketEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SupportTicketMapper {
    SupportTicketResponse convertEntityToResponse(SupportTicketEntity entity);
}
