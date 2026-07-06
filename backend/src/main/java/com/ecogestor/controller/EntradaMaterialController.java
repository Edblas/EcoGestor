package com.ecogestor.controller;

import com.ecogestor.dto.entrada.EntradaMaterialRequestDTO;
import com.ecogestor.dto.entrada.EntradaMaterialResponseDTO;
import com.ecogestor.service.EntradaMaterialService;
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
@RequestMapping("/api/entradas")
@RequiredArgsConstructor
public class EntradaMaterialController {

    private final EntradaMaterialService entradaMaterialService;

    @PostMapping
    public ResponseEntity<EntradaMaterialResponseDTO> registrar(@Valid @RequestBody EntradaMaterialRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(entradaMaterialService.registrar(dto));
    }

    @GetMapping
    public ResponseEntity<Page<EntradaMaterialResponseDTO>> listar(
            @RequestParam(required = false) UUID clienteId,
            @RequestParam(required = false) UUID fornecedorId,
            @RequestParam(required = false) UUID materialId,
            Pageable pageable) {
        return ResponseEntity.ok(entradaMaterialService.listar(clienteId, fornecedorId, materialId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntradaMaterialResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(entradaMaterialService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntradaMaterialResponseDTO> atualizar(@PathVariable UUID id, @Valid @RequestBody EntradaMaterialRequestDTO dto) {
        return ResponseEntity.ok(entradaMaterialService.atualizar(id, dto));
    }

    @GetMapping("/totais/valor-finalizadas")
    public ResponseEntity<BigDecimal> getTotalValorFinalizadas(
            @RequestParam(required = false) LocalDate inicio,
            @RequestParam(required = false) LocalDate fim) {
        if (inicio != null && fim != null) {
            return ResponseEntity.ok(entradaMaterialService.getTotalValorEntradasFinalizadasPorPeriodo(inicio, fim));
        }
        return ResponseEntity.ok(entradaMaterialService.getTotalValorEntradasFinalizadas());
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<EntradaMaterialResponseDTO> finalizar(@PathVariable UUID id) {
        return ResponseEntity.ok(entradaMaterialService.finalizar(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        entradaMaterialService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
