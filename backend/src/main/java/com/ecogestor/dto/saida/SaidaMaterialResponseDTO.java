package com.ecogestor.dto.saida;

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
public class SaidaMaterialResponseDTO {

    private UUID id;
    private UUID clienteId;
    private String clienteNome;
    private UUID materialId;
    private String materialNome;
    private BigDecimal peso;
    private BigDecimal valorKg;
    private BigDecimal valorTotal;
    private LocalDateTime dataSaida;
    private String observacoes;
    private LocalDateTime createdAt;
    private Boolean active;
}
