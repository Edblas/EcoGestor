package com.ecogestor.controller;

import com.ecogestor.dto.saida.SaidaMaterialRequestDTO;
import com.ecogestor.dto.saida.SaidaMaterialResponseDTO;
import com.ecogestor.service.SaidaMaterialService;
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
@RequestMapping("/api/saidas")
@RequiredArgsConstructor
public class SaidaMaterialController {

    private final SaidaMaterialService saidaMaterialService;

    @PostMapping
    public ResponseEntity<SaidaMaterialResponseDTO> registrar(@Valid @RequestBody SaidaMaterialRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(saidaMaterialService.registrar(dto));
    }

    @GetMapping
    public ResponseEntity<Page<SaidaMaterialResponseDTO>> listar(
            @RequestParam(required = false) UUID clienteId,
            @RequestParam(required = false) UUID materialId,
            Pageable pageable) {
        return ResponseEntity.ok(saidaMaterialService.listar(clienteId, materialId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaidaMaterialResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(saidaMaterialService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SaidaMaterialResponseDTO> atualizar(@PathVariable UUID id, @Valid @RequestBody SaidaMaterialRequestDTO dto) {
        return ResponseEntity.ok(saidaMaterialService.atualizar(id, dto));
    }

    @GetMapping("/totais/valor-finalizadas")
    public ResponseEntity<BigDecimal> getTotalValorFinalizadas(
            @RequestParam(required = false) LocalDate inicio,
            @RequestParam(required = false) LocalDate fim) {
        if (inicio != null && fim != null) {
            return ResponseEntity.ok(saidaMaterialService.getTotalValorSaidasFinalizadasPorPeriodo(inicio, fim));
        }
        return ResponseEntity.ok(saidaMaterialService.getTotalValorSaidasFinalizadas());
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<SaidaMaterialResponseDTO> finalizar(@PathVariable UUID id) {
        return ResponseEntity.ok(saidaMaterialService.finalizar(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        saidaMaterialService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
