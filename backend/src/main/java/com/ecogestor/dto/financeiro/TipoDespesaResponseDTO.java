package com.ecogestor.dto.financeiro;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoDespesaResponseDTO {

    private UUID id;
    private String nome;
    private String descricao;
    private LocalDateTime createdAt;
    private Boolean active;
}
