package com.ecogestor.controller;

import com.ecogestor.dto.financeiro.ReceitaRequestDTO;
import com.ecogestor.dto.financeiro.ReceitaResponseDTO;
import com.ecogestor.entity.StatusFinanceiro;
import com.ecogestor.service.ReceitaService;
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
@RequestMapping("/api/receitas")
@RequiredArgsConstructor
public class ReceitaController {

    private final ReceitaService receitaService;

    @PostMapping
    public ResponseEntity<ReceitaResponseDTO> criar(@Valid @RequestBody ReceitaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(receitaService.criar(dto));
    }

    @GetMapping
    public ResponseEntity<Page<ReceitaResponseDTO>> listar(
            @RequestParam(required = false) StatusFinanceiro status,
            @RequestParam(required = false) LocalDate inicio,
            @RequestParam(required = false) LocalDate fim,
            Pageable pageable) {
        return ResponseEntity.ok(receitaService.listar(status, inicio, fim, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceitaResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(receitaService.buscarPorId(id));
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalReceitas() {
        return ResponseEntity.ok(receitaService.getTotalReceitas());
    }

    @GetMapping("/total-recebido")
    public ResponseEntity<BigDecimal> getTotalRecebido() {
        return ResponseEntity.ok(receitaService.getTotalRecebido());
    }

    @GetMapping("/total-por-periodo")
    public ResponseEntity<BigDecimal> getTotalReceitasPorPeriodo(@RequestParam LocalDate inicio, @RequestParam LocalDate fim) {
        return ResponseEntity.ok(receitaService.getTotalReceitasPorPeriodo(inicio, fim));
    }

    @GetMapping("/total-recebido-por-periodo")
    public ResponseEntity<BigDecimal> getTotalRecebidoPorPeriodo(@RequestParam LocalDate inicio, @RequestParam LocalDate fim) {
        return ResponseEntity.ok(receitaService.getTotalRecebidoPorPeriodo(inicio, fim));
    }

    @GetMapping("/total-pendente")
    public ResponseEntity<BigDecimal> getTotalPendente() {
        return ResponseEntity.ok(receitaService.getTotalPendente());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReceitaResponseDTO> atualizar(@PathVariable UUID id, @Valid @RequestBody ReceitaRequestDTO dto) {
        return ResponseEntity.ok(receitaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        receitaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
