package com.ecogestor.mapper;

import com.ecogestor.dto.user.UserRequestDTO;
import com.ecogestor.dto.user.UserResponseDTO;
import com.ecogestor.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "password", ignore = true)
    User toEntity(UserRequestDTO dto);

    UserResponseDTO toResponseDTO(User entity);
}
