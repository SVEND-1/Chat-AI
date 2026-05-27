package org.example.chatai.roleApplication.domain;

import org.example.chatai.roleApplication.api.dto.response.RoleResponse;
import org.example.chatai.roleApplication.db.RoleApplicationEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleResponse convertEntityToDTO(RoleApplicationEntity entity);
    List<RoleResponse> convertEntityListToDTO(List<RoleApplicationEntity> entity);
}
