package com.ecogestor.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "entradas_materiais")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntradaMaterial extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id", nullable = false)
    private Fornecedor fornecedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movimentacao_estoque_id", nullable = false)
    private MovimentacaoEstoque movimentacaoEstoque;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal peso;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorKg;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(nullable = false)
    private LocalDateTime dataEntrada;

    @Column(columnDefinition = "TEXT")
    private String observacoes;
}
