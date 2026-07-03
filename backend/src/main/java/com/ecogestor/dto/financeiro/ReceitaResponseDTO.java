package com.ecogestor.dto.financeiro;

import com.ecogestor.entity.StatusFinanceiro;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceitaResponseDTO {

    private UUID id;
    private UUID saidaMaterialId;
    private UUID clienteId;
    private String clienteNome;
    private String descricao;
    private BigDecimal valor;
    private LocalDate dataRecebimento;
    private StatusFinanceiro status;
    private String observacoes;
    private LocalDateTime createdAt;
    private Boolean active;
}
