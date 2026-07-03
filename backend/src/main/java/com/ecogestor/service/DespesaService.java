package com.ecogestor.service;

import com.ecogestor.dto.financeiro.DespesaRequestDTO;
import com.ecogestor.dto.financeiro.DespesaResponseDTO;
import com.ecogestor.entity.*;
import com.ecogestor.exception.ResourceNotFoundException;
import com.ecogestor.mapper.DespesaMapper;
import com.ecogestor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DespesaService {

    private final DespesaRepository despesaRepository;
    private final TipoDespesaRepository tipoDespesaRepository;
    private final EntradaMaterialRepository entradaMaterialRepository;
    private final ClienteRepository clienteRepository;
    private final FornecedorRepository fornecedorRepository;
    private final DespesaMapper despesaMapper;

    @Transactional
    public DespesaResponseDTO criar(DespesaRequestDTO dto) {
        Despesa despesa = Despesa.builder()
                .descricao(dto.getDescricao())
                .valor(dto.getValor())
                .dataVencimento(dto.getDataVencimento())
                .dataPagamento(dto.getDataPagamento())
                .status(dto.getStatus())
                .observacoes(dto.getObservacoes())
                .build();

        if (dto.getTipoDespesaId() != null) {
            TipoDespesa tipoDespesa = tipoDespesaRepository.findById(dto.getTipoDespesaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tipo de despesa não encontrado"));
            despesa.setTipoDespesa(tipoDespesa);
        }

        if (dto.getEntradaMaterialId() != null) {
            EntradaMaterial entradaMaterial = entradaMaterialRepository.findById(dto.getEntradaMaterialId())
                    .orElseThrow(() -> new ResourceNotFoundException("Entrada de material não encontrada"));
            despesa.setEntradaMaterial(entradaMaterial);
        }

        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
            despesa.setCliente(cliente);
        }

        if (dto.getFornecedorId() != null) {
            Fornecedor fornecedor = fornecedorRepository.findById(dto.getFornecedorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado"));
            despesa.setFornecedor(fornecedor);
        }

        despesa = despesaRepository.save(despesa);
        return despesaMapper.toResponseDTO(despesa);
    }

    public Page<DespesaResponseDTO> listar(StatusFinanceiro status, Pageable pageable) {
        Page<Despesa> despesas;
        if (status != null) {
            despesas = despesaRepository.search(status, pageable);
        } else {
            despesas = despesaRepository.findAllActive(pageable);
        }
        return despesas.map(despesaMapper::toResponseDTO);
    }

    public DespesaResponseDTO buscarPorId(UUID id) {
        Despesa despesa = despesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Despesa não encontrada"));
        return despesaMapper.toResponseDTO(despesa);
    }

    public BigDecimal getTotalDespesas() {
        return despesaRepository.calcularTotalDespesas();
    }

    public BigDecimal getTotalPago() {
        return despesaRepository.calcularTotalPago();
    }

    public BigDecimal getTotalPendente() {
        return despesaRepository.calcularTotalPendente();
    }

    @Transactional
    public void deletar(UUID id) {
        Despesa despesa = despesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Despesa não encontrada"));
        despesa.setActive(false);
        despesaRepository.save(despesa);
    }
}
