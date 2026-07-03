package com.ecogestor.dto.financeiro;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoDespesaRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    private String descricao;
}
