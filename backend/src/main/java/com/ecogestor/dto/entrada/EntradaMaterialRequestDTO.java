package com.ecogestor.dto.entrada;

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
public class EntradaMaterialRequestDTO {

    @NotNull(message = "Fornecedor é obrigatório")
    private UUID fornecedorId;

    @NotNull(message = "Material é obrigatório")
    private UUID materialId;

    @NotNull(message = "Peso é obrigatório")
    @DecimalMin(value = "0.01", message = "Peso deve ser maior que zero")
    private BigDecimal peso;

    @NotNull(message = "Valor por kg é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor por kg deve ser maior que zero")
    private BigDecimal valorKg;

    private String observacoes;
}
