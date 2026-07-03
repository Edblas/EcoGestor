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
}
