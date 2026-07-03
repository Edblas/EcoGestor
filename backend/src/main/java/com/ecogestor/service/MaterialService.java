package com.ecogestor.service;

import com.ecogestor.dto.material.MaterialRequestDTO;
import com.ecogestor.dto.material.MaterialResponseDTO;
import com.ecogestor.entity.Material;
import com.ecogestor.exception.ResourceNotFoundException;
import com.ecogestor.mapper.MaterialMapper;
import com.ecogestor.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;

    public MaterialResponseDTO create(MaterialRequestDTO dto) {
        Material material = materialMapper.toEntity(dto);
        material.setActive(true);
        material = materialRepository.save(material);
        return materialMapper.toResponseDTO(material);
    }

    public Page<MaterialResponseDTO> search(String search, Pageable pageable) {
        Page<Material> materiais = materialRepository.search(search, pageable);
        return materiais.map(materialMapper::toResponseDTO);
    }

    public MaterialResponseDTO findById(UUID id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com id: " + id));
        return materialMapper.toResponseDTO(material);
    }

    public MaterialResponseDTO update(UUID id, MaterialRequestDTO dto) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com id: " + id));

        material.setNome(dto.getNome());
        material.setCategoria(dto.getCategoria());
        material.setUnidadeMedida(dto.getUnidadeMedida());
        material.setValorPadraoKg(dto.getValorPadraoKg());

        material = materialRepository.save(material);
        return materialMapper.toResponseDTO(material);
    }

    public void delete(UUID id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com id: " + id));
        material.setActive(false);
        materialRepository.save(material);
    }
}
