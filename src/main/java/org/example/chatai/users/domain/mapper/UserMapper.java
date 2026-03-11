package org.example.chatai.users.domain.mapper;

import org.example.chatai.users.api.dto.users.request.UserCreateRequest;
import org.example.chatai.users.api.dto.users.response.UserDTO;
import org.example.chatai.users.db.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO convertEntityToDto(UserEntity user);

    UserCreateRequest convertDtoToCreateRequest(UserEntity user);

    UserEntity convertDtoToEntity(UserDTO userDTO);
}
