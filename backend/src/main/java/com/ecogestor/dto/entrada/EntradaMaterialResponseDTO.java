package com.ecogestor.dto.entrada;

import com.ecogestor.entity.StatusEntradaMaterial;
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
public class EntradaMaterialResponseDTO {

    private UUID id;
    private UUID clienteId;
    private String clienteNome;
    private UUID fornecedorId;
    private String fornecedorNome;
    private UUID materialId;
    private String materialNome;
    private BigDecimal peso;
    private BigDecimal valorKg;
    private BigDecimal valorTotal;
    private StatusEntradaMaterial status;
    private LocalDateTime dataEntrada;
    private String observacoes;
    private LocalDateTime createdAt;
    private Boolean active;
}
