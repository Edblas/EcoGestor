package com.ecogestor.service;

import com.ecogestor.dto.estoque.MovimentacaoEstoqueRequestDTO;
import com.ecogestor.dto.estoque.MovimentacaoEstoqueResponseDTO;
import com.ecogestor.entity.Material;
import com.ecogestor.entity.MovimentacaoEstoque;
import com.ecogestor.entity.TipoMovimentacao;
import com.ecogestor.entity.User;
import com.ecogestor.exception.ResourceNotFoundException;
import com.ecogestor.mapper.MovimentacaoEstoqueMapper;
import com.ecogestor.repository.MaterialRepository;
import com.ecogestor.repository.MovimentacaoEstoqueRepository;
import com.ecogestor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MovimentacaoEstoqueService {

    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final MovimentacaoEstoqueMapper movimentacaoEstoqueMapper;

    @Transactional
    public MovimentacaoEstoqueResponseDTO registrar(MovimentacaoEstoqueRequestDTO dto) {
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com id: " + dto.getMaterialId()));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User usuario = null;
        if (authentication != null && authentication.isAuthenticated()) {
            usuario = userRepository.findByEmail(authentication.getName()).orElse(null);
        }

        MovimentacaoEstoque movimentacao = MovimentacaoEstoque.builder()
                .material(material)
                .tipo(dto.getTipo())
                .peso(dto.getPeso())
                .valor(dto.getValor())
                .dataMovimentacao(LocalDateTime.now())
                .usuario(usuario)
                .observacoes(dto.getObservacoes())
                .build();

        movimentacao = movimentacaoEstoqueRepository.save(movimentacao);
        return movimentacaoEstoqueMapper.toResponseDTO(movimentacao);
    }

    public Page<MovimentacaoEstoqueResponseDTO> listar(UUID materialId, TipoMovimentacao tipo, Pageable pageable) {
        Page<MovimentacaoEstoque> movimentacoes;
        if (materialId != null || tipo != null) {
            movimentacoes = movimentacaoEstoqueRepository.search(materialId, tipo, pageable);
        } else {
            movimentacoes = movimentacaoEstoqueRepository.findAllActive(pageable);
        }
        return movimentacoes.map(movimentacaoEstoqueMapper::toResponseDTO);
    }

    public MovimentacaoEstoqueResponseDTO buscarPorId(UUID id) {
        MovimentacaoEstoque movimentacao = movimentacaoEstoqueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimentação não encontrada com id: " + id));
        return movimentacaoEstoqueMapper.toResponseDTO(movimentacao);
    }

    public java.math.BigDecimal calcularSaldoEstoque(UUID materialId) {
        return movimentacaoEstoqueRepository.calcularSaldoEstoque(materialId);
    }

    public long contarMovimentacoesHoje(TipoMovimentacao tipo) {
        LocalDateTime inicioDia = LocalDateTime.now().toLocalDate().atStartOfDay();
        return movimentacaoEstoqueRepository.countByTipoAndDataMovimentacaoToday(tipo, inicioDia);
    }
}
