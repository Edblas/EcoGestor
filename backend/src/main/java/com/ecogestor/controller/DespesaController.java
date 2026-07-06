package com.ecogestor.controller;

import com.ecogestor.dto.financeiro.DespesaRequestDTO;
import com.ecogestor.dto.financeiro.DespesaResponseDTO;
import com.ecogestor.entity.StatusFinanceiro;
import com.ecogestor.service.DespesaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/despesas")
@RequiredArgsConstructor
public class DespesaController {

    private final DespesaService despesaService;

    @PostMapping
    public ResponseEntity<DespesaResponseDTO> criar(@Valid @RequestBody DespesaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(despesaService.criar(dto));
    }

    @GetMapping
    public ResponseEntity<Page<DespesaResponseDTO>> listar(
            @RequestParam(required = false) StatusFinanceiro status,
            @RequestParam(required = false) LocalDate inicio,
            @RequestParam(required = false) LocalDate fim,
            Pageable pageable) {
        return ResponseEntity.ok(despesaService.listar(status, inicio, fim, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DespesaResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(despesaService.buscarPorId(id));
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalDespesas() {
        return ResponseEntity.ok(despesaService.getTotalDespesas());
    }

    @GetMapping("/total-pago")
    public ResponseEntity<BigDecimal> getTotalPago() {
        return ResponseEntity.ok(despesaService.getTotalPago());
    }

    @GetMapping("/total-por-periodo")
    public ResponseEntity<BigDecimal> getTotalDespesasPorPeriodo(@RequestParam LocalDate inicio, @RequestParam LocalDate fim) {
        return ResponseEntity.ok(despesaService.getTotalDespesasPorPeriodo(inicio, fim));
    }

    @GetMapping("/total-pago-por-periodo")
    public ResponseEntity<BigDecimal> getTotalPagoPorPeriodo(@RequestParam LocalDate inicio, @RequestParam LocalDate fim) {
        return ResponseEntity.ok(despesaService.getTotalPagoPorPeriodo(inicio, fim));
    }

    @GetMapping("/total-pendente")
    public ResponseEntity<BigDecimal> getTotalPendente() {
        return ResponseEntity.ok(despesaService.getTotalPendente());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DespesaResponseDTO> atualizar(@PathVariable UUID id, @Valid @RequestBody DespesaRequestDTO dto) {
        return ResponseEntity.ok(despesaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        despesaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
