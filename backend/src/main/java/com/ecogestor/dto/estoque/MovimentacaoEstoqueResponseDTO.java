package com.ecogestor.dto.estoque;

import com.ecogestor.entity.TipoMovimentacao;
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
public class MovimentacaoEstoqueResponseDTO {

    private UUID id;
    private UUID materialId;
    private String materialNome;
    private TipoMovimentacao tipo;
    private BigDecimal peso;
    private BigDecimal valor;
    private LocalDateTime dataMovimentacao;
    private UUID usuarioId;
    private String usuarioNome;
    private String observacoes;
    private LocalDateTime createdAt;
    private Boolean active;
}
