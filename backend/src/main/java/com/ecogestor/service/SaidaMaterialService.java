package com.ecogestor.service;

import com.ecogestor.dto.estoque.MovimentacaoEstoqueRequestDTO;
import com.ecogestor.dto.saida.SaidaMaterialRequestDTO;
import com.ecogestor.dto.saida.SaidaMaterialResponseDTO;
import com.ecogestor.entity.Cliente;
import com.ecogestor.entity.Material;
import com.ecogestor.entity.MovimentacaoEstoque;
import com.ecogestor.entity.SaidaMaterial;
import com.ecogestor.entity.TipoMovimentacao;
import com.ecogestor.exception.ResourceNotFoundException;
import com.ecogestor.mapper.SaidaMaterialMapper;
import com.ecogestor.repository.ClienteRepository;
import com.ecogestor.repository.MaterialRepository;
import com.ecogestor.repository.SaidaMaterialRepository;
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
public class SaidaMaterialService {

    private final SaidaMaterialRepository saidaMaterialRepository;
    private final ClienteRepository clienteRepository;
    private final MaterialRepository materialRepository;
    private final MovimentacaoEstoqueService movimentacaoEstoqueService;
    private final SaidaMaterialMapper saidaMaterialMapper;

    @Transactional
    public SaidaMaterialResponseDTO registrar(SaidaMaterialRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + dto.getClienteId()));

        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com id: " + dto.getMaterialId()));

        // Verificar estoque
        BigDecimal saldoEstoque = movimentacaoEstoqueService.calcularSaldoEstoque(material.getId());
        if (saldoEstoque.compareTo(dto.getPeso()) < 0) {
            throw new IllegalArgumentException("Estoque insuficiente. Saldo atual: " + saldoEstoque + " kg");
        }

        // Registrar movimentação de estoque
        BigDecimal valorTotal = dto.getPeso().multiply(dto.getValorKg());
        MovimentacaoEstoqueRequestDTO movimentacaoDTO = MovimentacaoEstoqueRequestDTO.builder()
                .materialId(material.getId())
                .tipo(TipoMovimentacao.SAIDA)
                .peso(dto.getPeso())
                .valor(valorTotal)
                .observacoes("Saída/venda de material para " + cliente.getNome())
                .build();

        var movimentacaoResponse = movimentacaoEstoqueService.registrar(movimentacaoDTO);

        // Criar saída de material
        SaidaMaterial saida = SaidaMaterial.builder()
                .cliente(cliente)
                .material(material)
                .peso(dto.getPeso())
                .valorKg(dto.getValorKg())
                .valorTotal(valorTotal)
                .dataSaida(LocalDateTime.now())
                .observacoes(dto.getObservacoes())
                .build();

        // Associar movimentação
        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setId(movimentacaoResponse.getId());
        saida.setMovimentacaoEstoque(movimentacao);

        saida = saidaMaterialRepository.save(saida);
        return saidaMaterialMapper.toResponseDTO(saida);
    }

    public Page<SaidaMaterialResponseDTO> listar(UUID clienteId, UUID materialId, Pageable pageable) {
        Page<SaidaMaterial> saidas;
        if (clienteId != null || materialId != null) {
            saidas = saidaMaterialRepository.search(clienteId, materialId, pageable);
        } else {
            saidas = saidaMaterialRepository.findAllActive(pageable);
        }
        return saidas.map(saidaMaterialMapper::toResponseDTO);
    }

    public SaidaMaterialResponseDTO buscarPorId(UUID id) {
        SaidaMaterial saida = saidaMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Saída de material não encontrada com id: " + id));
        return saidaMaterialMapper.toResponseDTO(saida);
    }
}
