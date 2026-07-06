package com.ecogestor.mapper;

import com.ecogestor.dto.saida.SaidaMaterialResponseDTO;
import com.ecogestor.entity.SaidaMaterial;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SaidaMaterialMapper {

    @Mapping(target = "clienteId", source = "cliente.id")
    @Mapping(target = "clienteNome", source = "cliente.nome")
    @Mapping(target = "materialId", source = "material.id")
    @Mapping(target = "materialNome", source = "material.nome")
    @Mapping(target = "status", source = "status")
    SaidaMaterialResponseDTO toResponseDTO(SaidaMaterial entity);
}
