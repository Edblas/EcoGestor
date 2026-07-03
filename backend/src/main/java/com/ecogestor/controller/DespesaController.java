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
            Pageable pageable) {
        return ResponseEntity.ok(despesaService.listar(status, pageable));
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

    @GetMapping("/total-pendente")
    public ResponseEntity<BigDecimal> getTotalPendente() {
        return ResponseEntity.ok(despesaService.getTotalPendente());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        despesaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
