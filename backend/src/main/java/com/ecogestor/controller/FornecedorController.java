package com.ecogestor.controller;

import com.ecogestor.dto.fornecedor.FornecedorRequestDTO;
import com.ecogestor.dto.fornecedor.FornecedorResponseDTO;
import com.ecogestor.service.FornecedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/fornecedores")
@RequiredArgsConstructor
public class FornecedorController {

    private final FornecedorService fornecedorService;

    @PostMapping
    public ResponseEntity<FornecedorResponseDTO> create(@Valid @RequestBody FornecedorRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fornecedorService.create(dto));
    }

    @GetMapping
    public ResponseEntity<Page<FornecedorResponseDTO>> search(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(fornecedorService.search(search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FornecedorResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(fornecedorService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FornecedorResponseDTO> update(@PathVariable UUID id, @Valid @RequestBody FornecedorRequestDTO dto) {
        return ResponseEntity.ok(fornecedorService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        fornecedorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
