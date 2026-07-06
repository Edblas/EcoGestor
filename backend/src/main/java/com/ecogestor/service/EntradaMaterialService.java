package com.ecogestor.service;

import com.ecogestor.dto.entrada.EntradaMaterialRequestDTO;
import com.ecogestor.dto.entrada.EntradaMaterialResponseDTO;
import com.ecogestor.dto.estoque.MovimentacaoEstoqueRequestDTO;
import com.ecogestor.entity.Cliente;
import com.ecogestor.entity.EntradaMaterial;
import com.ecogestor.entity.Fornecedor;
import com.ecogestor.entity.Material;
import com.ecogestor.entity.MovimentacaoEstoque;
import com.ecogestor.entity.StatusEntradaMaterial;
import com.ecogestor.entity.TipoMovimentacao;
import com.ecogestor.exception.ResourceNotFoundException;
import com.ecogestor.mapper.EntradaMaterialMapper;
import com.ecogestor.repository.ClienteRepository;
import com.ecogestor.repository.EntradaMaterialRepository;
import com.ecogestor.repository.FornecedorRepository;
import com.ecogestor.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EntradaMaterialService {

    private final EntradaMaterialRepository entradaMaterialRepository;
    private final FornecedorRepository fornecedorRepository;
    private final ClienteRepository clienteRepository;
    private final MaterialRepository materialRepository;
    private final MovimentacaoEstoqueService movimentacaoEstoqueService;
    private final EntradaMaterialMapper entradaMaterialMapper;

    @Transactional
    public EntradaMaterialResponseDTO registrar(EntradaMaterialRequestDTO dto) {
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com id: " + dto.getMaterialId()));

        Cliente cliente = null;
        Fornecedor fornecedor = null;
        String nomeParceiro = "";

        if (dto.getClienteId() != null) {
            cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + dto.getClienteId()));
            nomeParceiro = cliente.getNome();
        } else if (dto.getFornecedorId() != null) {
            fornecedor = fornecedorRepository.findById(dto.getFornecedorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + dto.getFornecedorId()));
            nomeParceiro = fornecedor.getNome();
        } else {
            throw new IllegalArgumentException("É necessário informar um cliente ou fornecedor");
        }

        BigDecimal valorTotal = dto.getPeso().multiply(dto.getValorKg());
        EntradaMaterial entrada = EntradaMaterial.builder()
                .cliente(cliente)
                .fornecedor(fornecedor)
                .material(material)
                .peso(dto.getPeso())
                .valorKg(dto.getValorKg())
                .valorTotal(valorTotal)
                .status(dto.getStatus())
                .dataEntrada(dto.getDataEntrada() != null ? dto.getDataEntrada().atStartOfDay() : LocalDateTime.now())
                .observacoes(dto.getObservacoes())
                .build();

        if (dto.getStatus() == StatusEntradaMaterial.FINALIZADO) {
            entrada.setMovimentacaoEstoque(criarMovimentacaoEstoque(material, dto.getPeso(), valorTotal, nomeParceiro));
        }

        entrada = entradaMaterialRepository.save(entrada);
        return entradaMaterialMapper.toResponseDTO(entrada);
    }

    @Transactional
    public EntradaMaterialResponseDTO atualizar(UUID id, EntradaMaterialRequestDTO dto) {
        EntradaMaterial entrada = entradaMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrada de material não encontrada com id: " + id));

        if (!Boolean.TRUE.equals(entrada.getActive())) {
            throw new IllegalArgumentException("Não é possível editar uma entrada excluída.");
        }

        if (entrada.getStatus() != StatusEntradaMaterial.EM_ANDAMENTO) {
            throw new IllegalArgumentException("Só é possível editar entradas em andamento.");
        }

        if (dto.getStatus() != StatusEntradaMaterial.EM_ANDAMENTO) {
            throw new IllegalArgumentException("Status só pode ser alterado via finalização.");
        }

        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com id: " + dto.getMaterialId()));

        Cliente cliente = null;
        Fornecedor fornecedor = null;

        if (dto.getClienteId() != null) {
            cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + dto.getClienteId()));
        } else if (dto.getFornecedorId() != null) {
            fornecedor = fornecedorRepository.findById(dto.getFornecedorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + dto.getFornecedorId()));
        } else {
            throw new IllegalArgumentException("É necessário informar um cliente ou fornecedor");
        }

        BigDecimal valorTotal = dto.getPeso().multiply(dto.getValorKg());

        entrada.setCliente(cliente);
        entrada.setFornecedor(fornecedor);
        entrada.setMaterial(material);
        entrada.setPeso(dto.getPeso());
        entrada.setValorKg(dto.getValorKg());
        entrada.setValorTotal(valorTotal);
        entrada.setDataEntrada(dto.getDataEntrada().atStartOfDay());
        entrada.setObservacoes(dto.getObservacoes());

        entrada = entradaMaterialRepository.save(entrada);
        return entradaMaterialMapper.toResponseDTO(entrada);
    }

    public Page<EntradaMaterialResponseDTO> listar(UUID clienteId, UUID fornecedorId, UUID materialId, Pageable pageable) {
        Page<EntradaMaterial> entradas;
        if (clienteId != null || fornecedorId != null || materialId != null) {
            entradas = entradaMaterialRepository.search(clienteId, fornecedorId, materialId, pageable);
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

    public BigDecimal getTotalValorEntradasFinalizadas() {
        return entradaMaterialRepository.calcularTotalValorEntradasFinalizadas();
    }

    public BigDecimal getTotalValorEntradasFinalizadasPorPeriodo(LocalDate inicio, LocalDate fim) {
        return entradaMaterialRepository.calcularTotalValorEntradasFinalizadasPorPeriodo(inicio.atStartOfDay(), fim.atTime(23, 59, 59));
    }

    @Transactional
    public EntradaMaterialResponseDTO finalizar(UUID id) {
        EntradaMaterial entrada = entradaMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrada de material não encontrada com id: " + id));

        if (!Boolean.TRUE.equals(entrada.getActive())) {
            throw new IllegalArgumentException("Não é possível finalizar uma entrada excluída.");
        }

        if (entrada.getStatus() == StatusEntradaMaterial.FINALIZADO) {
            throw new IllegalArgumentException("Esta entrada já está finalizada.");
        }

        String nomeParceiro = obterNomeParceiro(entrada);
        entrada.setMovimentacaoEstoque(
                criarMovimentacaoEstoque(entrada.getMaterial(), entrada.getPeso(), entrada.getValorTotal(), nomeParceiro)
        );
        entrada.setStatus(StatusEntradaMaterial.FINALIZADO);

        entrada = entradaMaterialRepository.save(entrada);
        return entradaMaterialMapper.toResponseDTO(entrada);
    }

    @Transactional
    public void delete(UUID id) {
        EntradaMaterial entrada = entradaMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entrada de material não encontrada com id: " + id));

        if (!Boolean.TRUE.equals(entrada.getActive())) {
            throw new IllegalArgumentException("Esta entrada já foi excluída.");
        }

        if (entrada.getStatus() == StatusEntradaMaterial.FINALIZADO && entrada.getMovimentacaoEstoque() != null) {
            BigDecimal saldoAtual = movimentacaoEstoqueService.calcularSaldoEstoque(entrada.getMaterial().getId());
            BigDecimal saldoProjetado = saldoAtual.subtract(entrada.getPeso());
            if (saldoProjetado.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Não é possível excluir esta entrada porque isso deixaria o estoque do material negativo.");
            }
        }

        entrada.setActive(false);
        entradaMaterialRepository.save(entrada);

        if (entrada.getMovimentacaoEstoque() != null) {
            movimentacaoEstoqueService.inativar(entrada.getMovimentacaoEstoque().getId());
        }
    }

    private MovimentacaoEstoque criarMovimentacaoEstoque(Material material, BigDecimal peso, BigDecimal valorTotal, String nomeParceiro) {
        MovimentacaoEstoqueRequestDTO movimentacaoDTO = MovimentacaoEstoqueRequestDTO.builder()
                .materialId(material.getId())
                .tipo(TipoMovimentacao.ENTRADA)
                .peso(peso)
                .valor(valorTotal)
                .observacoes("Entrada de material de " + nomeParceiro)
                .build();

        var movimentacaoResponse = movimentacaoEstoqueService.registrar(movimentacaoDTO);
        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setId(movimentacaoResponse.getId());
        return movimentacao;
    }

    private String obterNomeParceiro(EntradaMaterial entrada) {
        if (entrada.getCliente() != null) {
            return entrada.getCliente().getNome();
        }

        if (entrada.getFornecedor() != null) {
            return entrada.getFornecedor().getNome();
        }

        return "parceiro não informado";
    }
}
