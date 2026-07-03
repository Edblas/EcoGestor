package com.ecogestor.mapper;

import com.ecogestor.dto.estoque.MovimentacaoEstoqueRequestDTO;
import com.ecogestor.dto.estoque.MovimentacaoEstoqueResponseDTO;
import com.ecogestor.entity.MovimentacaoEstoque;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MovimentacaoEstoqueMapper {

    @Mapping(target = "materialId", source = "material.id")
    @Mapping(target = "materialNome", source = "material.nome")
    @Mapping(target = "usuarioId", source = "usuario.id")
    @Mapping(target = "usuarioNome", source = "usuario.name")
    MovimentacaoEstoqueResponseDTO toResponseDTO(MovimentacaoEstoque entity);
}
