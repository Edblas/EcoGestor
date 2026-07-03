package com.ecogestor.controller;

import com.ecogestor.dto.estoque.MovimentacaoEstoqueRequestDTO;
import com.ecogestor.dto.estoque.MovimentacaoEstoqueResponseDTO;
import com.ecogestor.entity.TipoMovimentacao;
import com.ecogestor.service.MovimentacaoEstoqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/estoque/movimentacoes")
@RequiredArgsConstructor
public class MovimentacaoEstoqueController {

    private final MovimentacaoEstoqueService movimentacaoEstoqueService;

    @PostMapping
    public ResponseEntity<MovimentacaoEstoqueResponseDTO> registrar(@Valid @RequestBody MovimentacaoEstoqueRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(movimentacaoEstoqueService.registrar(dto));
    }

    @GetMapping
    public ResponseEntity<Page<MovimentacaoEstoqueResponseDTO>> listar(
            @RequestParam(required = false) UUID materialId,
            @RequestParam(required = false) TipoMovimentacao tipo,
            Pageable pageable) {
        return ResponseEntity.ok(movimentacaoEstoqueService.listar(materialId, tipo, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimentacaoEstoqueResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(movimentacaoEstoqueService.buscarPorId(id));
    }

    @GetMapping("/saldo/{materialId}")
    public ResponseEntity<java.math.BigDecimal> calcularSaldoEstoque(@PathVariable UUID materialId) {
        return ResponseEntity.ok(movimentacaoEstoqueService.calcularSaldoEstoque(materialId));
    }

    @GetMapping("/hoje/{tipo}")
    public ResponseEntity<Long> contarMovimentacoesHoje(@PathVariable TipoMovimentacao tipo) {
        return ResponseEntity.ok(movimentacaoEstoqueService.contarMovimentacoesHoje(tipo));
    }
}
