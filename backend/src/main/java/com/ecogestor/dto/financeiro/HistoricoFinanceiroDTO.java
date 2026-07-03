package com.ecogestor.dto.financeiro;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoFinanceiroDTO {
    private BigDecimal totalDespesas;
    private BigDecimal totalDespesasPagas;
    private BigDecimal totalReceitas;
    private BigDecimal totalReceitasRecebidas;
    private BigDecimal saldo;
}
