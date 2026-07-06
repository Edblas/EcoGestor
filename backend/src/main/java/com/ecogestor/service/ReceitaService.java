package com.ecogestor.service;

import com.ecogestor.dto.financeiro.ReceitaRequestDTO;
import com.ecogestor.dto.financeiro.ReceitaResponseDTO;
import com.ecogestor.entity.*;
import com.ecogestor.exception.ResourceNotFoundException;
import com.ecogestor.mapper.ReceitaMapper;
import com.ecogestor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReceitaService {

    private final ReceitaRepository receitaRepository;
    private final SaidaMaterialRepository saidaMaterialRepository;
    private final ClienteRepository clienteRepository;
    private final ReceitaMapper receitaMapper;

    @Transactional
    public ReceitaResponseDTO criar(ReceitaRequestDTO dto) {
        Receita receita = Receita.builder()
                .descricao(dto.getDescricao())
                .valor(dto.getValor())
                .dataRecebimento(dto.getDataRecebimento())
                .status(dto.getStatus())
                .observacoes(dto.getObservacoes())
                .build();

        if (dto.getSaidaMaterialId() != null) {
            SaidaMaterial saidaMaterial = saidaMaterialRepository.findById(dto.getSaidaMaterialId())
                    .orElseThrow(() -> new ResourceNotFoundException("Saída de material não encontrada"));
            receita.setSaidaMaterial(saidaMaterial);
        }

        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
            receita.setCliente(cliente);
        }

        receita = receitaRepository.save(receita);
        return receitaMapper.toResponseDTO(receita);
    }

    public Page<ReceitaResponseDTO> listar(StatusFinanceiro status, LocalDate inicio, LocalDate fim, Pageable pageable) {
        Page<Receita> receitas = receitaRepository.search(status, inicio, fim, pageable);
        return receitas.map(receitaMapper::toResponseDTO);
    }

    public ReceitaResponseDTO buscarPorId(UUID id) {
        Receita receita = receitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receita não encontrada"));
        return receitaMapper.toResponseDTO(receita);
    }

    public BigDecimal getTotalReceitas() {
        return receitaRepository.calcularTotalReceitas();
    }

    public BigDecimal getTotalRecebido() {
        return receitaRepository.calcularTotalRecebido();
    }

    public BigDecimal getTotalReceitasPorPeriodo(LocalDate inicio, LocalDate fim) {
        return receitaRepository.calcularTotalPorPeriodo(inicio, fim);
    }

    public BigDecimal getTotalRecebidoPorPeriodo(LocalDate inicio, LocalDate fim) {
        return receitaRepository.calcularTotalRecebidoPorPeriodo(inicio, fim);
    }

    public BigDecimal getTotalPendente() {
        return receitaRepository.calcularTotalPendente();
    }

    @Transactional
    public ReceitaResponseDTO atualizar(UUID id, ReceitaRequestDTO dto) {
        Receita receita = receitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receita não encontrada"));

        if (!Boolean.TRUE.equals(receita.getActive())) {
            throw new IllegalArgumentException("Não é possível editar uma receita excluída.");
        }

        receita.setDescricao(dto.getDescricao());
        receita.setValor(dto.getValor());
        receita.setDataRecebimento(dto.getDataRecebimento());
        receita.setStatus(dto.getStatus());
        receita.setObservacoes(dto.getObservacoes());

        if (dto.getSaidaMaterialId() != null) {
            SaidaMaterial saidaMaterial = saidaMaterialRepository.findById(dto.getSaidaMaterialId())
                    .orElseThrow(() -> new ResourceNotFoundException("Saída de material não encontrada"));
            receita.setSaidaMaterial(saidaMaterial);
        } else {
            receita.setSaidaMaterial(null);
        }

        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
            receita.setCliente(cliente);
        } else {
            receita.setCliente(null);
        }

        receita = receitaRepository.save(receita);
        return receitaMapper.toResponseDTO(receita);
    }

    @Transactional
    public void deletar(UUID id) {
        Receita receita = receitaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receita não encontrada"));
        receita.setActive(false);
        receitaRepository.save(receita);
    }
}
