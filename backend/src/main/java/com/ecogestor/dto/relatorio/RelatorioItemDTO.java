package com.ecogestor.dto.relatorio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelatorioItemDTO {
    private String tipo;
    private String material;
    private String cliente;
    private String fornecedor;
    private BigDecimal peso;
    private BigDecimal valorKg;
    private BigDecimal valorTotal;
    private LocalDateTime data;
    private String observacoes;
}
