package com.ecogestor.dto.estoque;

import com.ecogestor.entity.TipoMovimentacao;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovimentacaoEstoqueRequestDTO {

    @NotNull(message = "Material é obrigatório")
    private UUID materialId;

    @NotNull(message = "Tipo de movimentação é obrigatório")
    private TipoMovimentacao tipo;

    @NotNull(message = "Peso é obrigatório")
    @DecimalMin(value = "0.01", message = "Peso deve ser maior que zero")
    private BigDecimal peso;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    private String observacoes;
}
