package com.ecogestor.mapper;

import com.ecogestor.dto.fornecedor.FornecedorRequestDTO;
import com.ecogestor.dto.fornecedor.FornecedorResponseDTO;
import com.ecogestor.entity.Fornecedor;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FornecedorMapper {

    Fornecedor toEntity(FornecedorRequestDTO dto);

    FornecedorResponseDTO toResponseDTO(Fornecedor entity);
}
