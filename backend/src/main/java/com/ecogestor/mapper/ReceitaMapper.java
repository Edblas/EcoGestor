package com.ecogestor.mapper;

import com.ecogestor.dto.financeiro.ReceitaResponseDTO;
import com.ecogestor.entity.Receita;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReceitaMapper {

    @Mapping(target = "saidaMaterialId", source = "saidaMaterial.id")
    @Mapping(target = "clienteId", source = "cliente.id")
    @Mapping(target = "clienteNome", source = "cliente.nome")
    ReceitaResponseDTO toResponseDTO(Receita entity);
}
