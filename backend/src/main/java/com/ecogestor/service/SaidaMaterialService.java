package com.ecogestor.service;

import com.ecogestor.dto.estoque.MovimentacaoEstoqueRequestDTO;
import com.ecogestor.dto.saida.SaidaMaterialRequestDTO;
import com.ecogestor.dto.saida.SaidaMaterialResponseDTO;
import com.ecogestor.entity.Cliente;
import com.ecogestor.entity.Material;
import com.ecogestor.entity.MovimentacaoEstoque;
import com.ecogestor.entity.SaidaMaterial;
import com.ecogestor.entity.StatusSaidaMaterial;
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
import java.time.LocalDate;
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

        BigDecimal valorTotal = dto.getPeso().multiply(dto.getValorKg());
        SaidaMaterial saida = SaidaMaterial.builder()
                .cliente(cliente)
                .material(material)
                .peso(dto.getPeso())
                .valorKg(dto.getValorKg())
                .valorTotal(valorTotal)
                .status(dto.getStatus())
                .dataSaida(dto.getDataSaida().atStartOfDay())
                .observacoes(dto.getObservacoes())
                .build();

        if (dto.getStatus() == StatusSaidaMaterial.FINALIZADO) {
            validarSaldo(material.getId(), dto.getPeso());
            saida.setMovimentacaoEstoque(criarMovimentacaoEstoque(material, dto.getPeso(), valorTotal, cliente.getNome()));
        }

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

    @Transactional
    public SaidaMaterialResponseDTO atualizar(UUID id, SaidaMaterialRequestDTO dto) {
        SaidaMaterial saida = saidaMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Saída de material não encontrada com id: " + id));

        if (!Boolean.TRUE.equals(saida.getActive())) {
            throw new IllegalArgumentException("Não é possível editar uma saída excluída.");
        }

        if (saida.getStatus() != StatusSaidaMaterial.EM_ANDAMENTO) {
            throw new IllegalArgumentException("Só é possível editar saídas em andamento.");
        }

        if (dto.getStatus() != StatusSaidaMaterial.EM_ANDAMENTO) {
            throw new IllegalArgumentException("Status só pode ser alterado via finalização.");
        }

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + dto.getClienteId()));

        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com id: " + dto.getMaterialId()));

        BigDecimal valorTotal = dto.getPeso().multiply(dto.getValorKg());

        saida.setCliente(cliente);
        saida.setMaterial(material);
        saida.setPeso(dto.getPeso());
        saida.setValorKg(dto.getValorKg());
        saida.setValorTotal(valorTotal);
        saida.setDataSaida(dto.getDataSaida().atStartOfDay());
        saida.setObservacoes(dto.getObservacoes());

        saida = saidaMaterialRepository.save(saida);
        return saidaMaterialMapper.toResponseDTO(saida);
    }

    public BigDecimal getTotalValorSaidasFinalizadas() {
        return saidaMaterialRepository.calcularTotalValorSaidasFinalizadas();
    }

    public BigDecimal getTotalValorSaidasFinalizadasPorPeriodo(LocalDate inicio, LocalDate fim) {
        return saidaMaterialRepository.calcularTotalValorSaidasFinalizadasPorPeriodo(inicio.atStartOfDay(), fim.atTime(23, 59, 59));
    }

    @Transactional
    public SaidaMaterialResponseDTO finalizar(UUID id) {
        SaidaMaterial saida = saidaMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Saída de material não encontrada com id: " + id));

        if (!Boolean.TRUE.equals(saida.getActive())) {
            throw new IllegalArgumentException("Não é possível finalizar uma saída excluída.");
        }

        if (saida.getStatus() == StatusSaidaMaterial.FINALIZADO) {
            throw new IllegalArgumentException("Esta saída já está finalizada.");
        }

        validarSaldo(saida.getMaterial().getId(), saida.getPeso());
        saida.setMovimentacaoEstoque(
                criarMovimentacaoEstoque(saida.getMaterial(), saida.getPeso(), saida.getValorTotal(), saida.getCliente().getNome())
        );
        saida.setStatus(StatusSaidaMaterial.FINALIZADO);

        saida = saidaMaterialRepository.save(saida);
        return saidaMaterialMapper.toResponseDTO(saida);
    }

    @Transactional
    public void delete(UUID id) {
        SaidaMaterial saida = saidaMaterialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Saída de material não encontrada com id: " + id));

        if (!Boolean.TRUE.equals(saida.getActive())) {
            throw new IllegalArgumentException("Esta saída já foi excluída.");
        }

        saida.setActive(false);
        saidaMaterialRepository.save(saida);

        if (saida.getMovimentacaoEstoque() != null) {
            movimentacaoEstoqueService.inativar(saida.getMovimentacaoEstoque().getId());
        }
    }

    private void validarSaldo(UUID materialId, BigDecimal peso) {
        BigDecimal saldoEstoque = movimentacaoEstoqueService.calcularSaldoEstoque(materialId);
        if (saldoEstoque.compareTo(peso) < 0) {
            throw new IllegalArgumentException("Estoque insuficiente. Saldo atual: " + saldoEstoque + " kg");
        }
    }

    private MovimentacaoEstoque criarMovimentacaoEstoque(Material material, BigDecimal peso, BigDecimal valorTotal, String nomeCliente) {
        MovimentacaoEstoqueRequestDTO movimentacaoDTO = MovimentacaoEstoqueRequestDTO.builder()
                .materialId(material.getId())
                .tipo(TipoMovimentacao.SAIDA)
                .peso(peso)
                .valor(valorTotal)
                .observacoes("Saída/venda de material para " + nomeCliente)
                .build();

        var movimentacaoResponse = movimentacaoEstoqueService.registrar(movimentacaoDTO);
        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setId(movimentacaoResponse.getId());
        return movimentacao;
    }
}
