package com.ecogestor.mapper;

import com.ecogestor.dto.cliente.ClienteRequestDTO;
import com.ecogestor.dto.cliente.ClienteResponseDTO;
import com.ecogestor.entity.Cliente;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ClienteMapper {

    Cliente toEntity(ClienteRequestDTO dto);

    ClienteResponseDTO toResponseDTO(Cliente entity);
}
