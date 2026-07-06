package com.ecogestor.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "saidas_materiais")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaidaMaterial extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movimentacao_estoque_id")
    private MovimentacaoEstoque movimentacaoEstoque;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSaidaMaterial status;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal peso;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorKg;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(nullable = false)
    private LocalDateTime dataSaida;

    @Column(columnDefinition = "TEXT")
    private String observacoes;
}
