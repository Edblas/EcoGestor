package com.ecogestor.dto.cliente;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponseDTO {

    private UUID id;
    private String nome;
    private String cpfCnpj;
    private String telefone;
    private String whatsapp;
    private String email;
    private String endereco;
    private String cidade;
    private String estado;
    private String cep;
    private String observacoes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean active;
}
