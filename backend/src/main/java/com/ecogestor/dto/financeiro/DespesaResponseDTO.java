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
public class DespesaResponseDTO {

    private UUID id;
    private UUID tipoDespesaId;
    private String tipoDespesaNome;
    private UUID entradaMaterialId;
    private UUID clienteId;
    private String clienteNome;
    private UUID fornecedorId;
    private String fornecedorNome;
    private String descricao;
    private BigDecimal valor;
    private LocalDate dataVencimento;
    private LocalDate dataPagamento;
    private StatusFinanceiro status;
    private String observacoes;
    private LocalDateTime createdAt;
    private Boolean active;
}
