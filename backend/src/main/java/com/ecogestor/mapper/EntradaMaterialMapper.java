package com.ecogestor.mapper;

import com.ecogestor.dto.entrada.EntradaMaterialResponseDTO;
import com.ecogestor.entity.EntradaMaterial;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EntradaMaterialMapper {

    @Mapping(target = "fornecedorId", source = "fornecedor.id")
    @Mapping(target = "fornecedorNome", source = "fornecedor.nome")
    @Mapping(target = "materialId", source = "material.id")
    @Mapping(target = "materialNome", source = "material.nome")
    EntradaMaterialResponseDTO toResponseDTO(EntradaMaterial entity);
}
