package com.ecogestor.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fornecedores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fornecedor extends BaseEntity {

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String cpfCnpj;

    @Column(nullable = false)
    private String telefone;

    private String whatsapp;

    private String email;

    private String endereco;

    private String cidade;

    private String estado;

    private String cep;

    @Column(columnDefinition = "TEXT")
    private String observacoes;
}
