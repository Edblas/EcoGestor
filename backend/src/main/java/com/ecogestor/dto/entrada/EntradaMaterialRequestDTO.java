package com.ecogestor.dto.entrada;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.ecogestor.entity.StatusEntradaMaterial;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EntradaMaterialRequestDTO {

    private UUID clienteId;

    private UUID fornecedorId;

    @NotNull(message = "Material é obrigatório")
    private UUID materialId;

    @NotNull(message = "Peso é obrigatório")
    @DecimalMin(value = "0.01", message = "Peso deve ser maior que zero")
    private BigDecimal peso;

    @NotNull(message = "Valor por kg é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor por kg deve ser maior que zero")
    private BigDecimal valorKg;

    @NotNull(message = "Status é obrigatório")
    private StatusEntradaMaterial status;

    @NotNull(message = "Data da entrada é obrigatória")
    private LocalDate dataEntrada;

    private String observacoes;
}
