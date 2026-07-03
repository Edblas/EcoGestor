package com.ecogestor.mapper;

import com.ecogestor.dto.financeiro.TipoDespesaResponseDTO;
import com.ecogestor.entity.TipoDespesa;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TipoDespesaMapper {
    TipoDespesaResponseDTO toResponseDTO(TipoDespesa entity);
}
