package org.example.chatai.supportMessages.domain.mappers;

import org.example.chatai.supportMessages.api.dto.responses.SupportMessageResponse;
import org.example.chatai.supportMessages.db.entities.SupportMessageEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SupportMessageMapper {
    SupportMessageResponse convertEntityToResponse(SupportMessageEntity entity);
    List<SupportMessageResponse> convertEntityListToResponseList(List<SupportMessageEntity> supportMessageEntities);
}
