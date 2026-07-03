package com.ecogestor.service;

import com.ecogestor.dto.financeiro.TipoDespesaRequestDTO;
import com.ecogestor.dto.financeiro.TipoDespesaResponseDTO;
import com.ecogestor.entity.TipoDespesa;
import com.ecogestor.exception.ResourceNotFoundException;
import com.ecogestor.mapper.TipoDespesaMapper;
import com.ecogestor.repository.TipoDespesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TipoDespesaService {

    private final TipoDespesaRepository tipoDespesaRepository;
    private final TipoDespesaMapper tipoDespesaMapper;

    @Transactional
    public TipoDespesaResponseDTO criar(TipoDespesaRequestDTO dto) {
        TipoDespesa tipoDespesa = TipoDespesa.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .build();
        tipoDespesa = tipoDespesaRepository.save(tipoDespesa);
        return tipoDespesaMapper.toResponseDTO(tipoDespesa);
    }

    public Page<TipoDespesaResponseDTO> listar(Pageable pageable) {
        return tipoDespesaRepository.findAllActive(pageable)
                .map(tipoDespesaMapper::toResponseDTO);
    }

    public TipoDespesaResponseDTO buscarPorId(UUID id) {
        TipoDespesa tipoDespesa = tipoDespesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de despesa não encontrado"));
        return tipoDespesaMapper.toResponseDTO(tipoDespesa);
    }

    @Transactional
    public void deletar(UUID id) {
        TipoDespesa tipoDespesa = tipoDespesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de despesa não encontrado"));
        tipoDespesa.setActive(false);
        tipoDespesaRepository.save(tipoDespesa);
    }
}
