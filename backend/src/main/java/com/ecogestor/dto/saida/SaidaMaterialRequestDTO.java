package com.ecogestor.dto.saida;

import com.ecogestor.entity.StatusSaidaMaterial;
import jakarta.validation.constraints.DecimalMin;
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
public class SaidaMaterialRequestDTO {

    @NotNull(message = "Cliente é obrigatório")
    private UUID clienteId;

    @NotNull(message = "Material é obrigatório")
    private UUID materialId;

    @NotNull(message = "Peso é obrigatório")
    @DecimalMin(value = "0.01", message = "Peso deve ser maior que zero")
    private BigDecimal peso;

    @NotNull(message = "Valor por kg é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor por kg deve ser maior que zero")
    private BigDecimal valorKg;

    @NotNull(message = "Status é obrigatório")
    private StatusSaidaMaterial status;

    @NotNull(message = "Data da saída é obrigatória")
    private LocalDate dataSaida;

    private String observacoes;
}
