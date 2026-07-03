package com.ecogestor.dto.financeiro;

import com.ecogestor.entity.StatusFinanceiro;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceitaRequestDTO {

    private UUID saidaMaterialId;
    private UUID clienteId;

    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    private LocalDate dataRecebimento;

    @NotNull(message = "Status é obrigatório")
    private StatusFinanceiro status;

    private String observacoes;
}
