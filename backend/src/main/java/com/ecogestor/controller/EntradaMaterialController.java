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
}
