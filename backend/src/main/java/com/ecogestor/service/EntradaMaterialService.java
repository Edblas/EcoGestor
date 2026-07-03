package com.ecogestor.service;

import com.ecogestor.dto.entrada.EntradaMaterialRequestDTO;
import com.ecogestor.dto.entrada.EntradaMaterialResponseDTO;
import com.ecogestor.dto.estoque.MovimentacaoEstoqueRequestDTO;
import com.ecogestor.entity.EntradaMaterial;
import com.ecogestor.entity.Fornecedor;
import com.ecogestor.entity.Material;
import com.ecogestor.entity.MovimentacaoEstoque;
import com.ecogestor.entity.TipoMovimentacao;
import com.ecogestor.exception.ResourceNotFoundException;
import com.ecogestor.mapper.EntradaMaterialMapper;
import com.ecogestor.repository.EntradaMaterialRepository;
import com.ecogestor.repository.FornecedorRepository;
import com.ecogestor.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EntradaMaterialService {

    private final EntradaMaterialRepository entradaMaterialRepository;
    private final FornecedorRepository fornecedorRepository;
    private final MaterialRepository materialRepository;
    private final MovimentacaoEstoqueService movimentacaoEstoqueService;
    private final EntradaMaterialMapper entradaMaterialMapper;

    @Transactional
    public EntradaMaterialResponseDTO registrar(EntradaMaterialRequestDTO dto) {
        Fornecedor fornecedor = fornecedorRepository.findById(dto.getFornecedorId())
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + dto.getFornecedorId()));

        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com id: " + dto.getMaterialId()));

        // Registrar movimentação de estoque
        BigDecimal valorTotal = dto.getPeso().multiply(dto.getValorKg());
        MovimentacaoEstoqueRequestDTO movimentacaoDTO = MovimentacaoEstoqueRequestDTO.builder()
                .materialId(material.getId())
                .tipo(TipoMovimentacao.ENTRADA)
                .peso(dto.getPeso())
                .valor(valorTotal)
                .observacoes("Entrada de material de " + fornecedor.getNome())
                .build();

        var movimentacaoResponse = movimentacaoEstoqueService.registrar(movimentacaoDTO);

        // Criar entrada de material
        EntradaMaterial entrada = EntradaMaterial.builder()
                .fornecedor(fornecedor)
                .material(material)
                .peso(dto.getPeso())
                .valorKg(dto.getValorKg())
                .valorTotal(valorTotal)
                .dataEntrada(LocalDateTime.now())
                .observacoes(dto.getObservacoes())
                .build();

        // Buscar a movimentação criada para associar
        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setId(movimentacaoResponse.getId());
        entrada.setMovimentacaoEstoque(movimentacao);

        entrada = entradaMaterialRepository.save(entrada);
        return entradaMaterialMapper.toResponseDTO(entrada);
    }

    public Page<EntradaMaterialResponseDTO> listar(UUID fornecedorId, UUID materialId, Pageable pageable) {
        Page<EntradaMaterial> entradas;
        if (fornecedorId != null || materialId != null) {
            entradas = entradaMaterialRepository.search(fornecedorId, materialId, pageable);
        } else {
            entradas = entradaMaterialRepository.findAllActive(pageable);
        }
        return entradas.map(entradaMaterialMapper::toResponseDTO);
    }

    public EntradaMaterialResponseDTO buscarPorId(UUID id) {
        EntradaMaterial entrada = entradaMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrada de material não encontrada com id: " + id));
        return entradaMaterialMapper.toResponseDTO(entrada);
    }
}
