package com.ecogestor.controller;

import com.ecogestor.dto.financeiro.TipoDespesaRequestDTO;
import com.ecogestor.dto.financeiro.TipoDespesaResponseDTO;
import com.ecogestor.service.TipoDespesaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/tipos-despesa")
@RequiredArgsConstructor
public class TipoDespesaController {

    private final TipoDespesaService tipoDespesaService;

    @PostMapping
    public ResponseEntity<TipoDespesaResponseDTO> criar(@Valid @RequestBody TipoDespesaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tipoDespesaService.criar(dto));
    }

    @GetMapping
    public ResponseEntity<Page<TipoDespesaResponseDTO>> listar(Pageable pageable) {
        return ResponseEntity.ok(tipoDespesaService.listar(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoDespesaResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(tipoDespesaService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        tipoDespesaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
