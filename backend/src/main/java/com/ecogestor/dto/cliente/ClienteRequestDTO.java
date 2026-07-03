package com.ecogestor.dto.cliente;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "CPF/CNPJ é obrigatório")
    private String cpfCnpj;

    @NotBlank(message = "Telefone é obrigatório")
    private String telefone;

    private String whatsapp;

    private String email;

    private String endereco;

    private String cidade;

    private String estado;

    private String cep;

    private String observacoes;
}
