package com.ecogestor.dto.material;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialResponseDTO {

    private UUID id;
    private String nome;
    private String categoria;
    private String unidadeMedida;
    private BigDecimal valorPadraoKg;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;
}
