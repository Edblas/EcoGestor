package com.ecogestor.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tipos_despesa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoDespesa extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String nome; // ÁGUA, LUZ, TELEFONE, ALUGUEL, COMBUSTÍVEL, OUTROS

    @Column(columnDefinition = "TEXT")
    private String descricao;
}
