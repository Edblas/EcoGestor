package com.ecogestor.controller;

import com.ecogestor.dto.material.MaterialRequestDTO;
import com.ecogestor.dto.material.MaterialResponseDTO;
import com.ecogestor.service.MaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/materiais")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping
    public ResponseEntity<MaterialResponseDTO> create(@Valid @RequestBody MaterialRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(materialService.create(dto));
    }

    @GetMapping
    public ResponseEntity<Page<MaterialResponseDTO>> search(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(materialService.search(search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(materialService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> update(@PathVariable UUID id, @Valid @RequestBody MaterialRequestDTO dto) {
        return ResponseEntity.ok(materialService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        materialService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
