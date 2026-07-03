package com.ecogestor.mapper;

import com.ecogestor.dto.material.MaterialRequestDTO;
import com.ecogestor.dto.material.MaterialResponseDTO;
import com.ecogestor.entity.Material;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MaterialMapper {

    Material toEntity(MaterialRequestDTO dto);

    MaterialResponseDTO toResponseDTO(Material entity);
}
