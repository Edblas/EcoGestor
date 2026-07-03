package com.ecogestor.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "despesas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Despesa extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_despesa_id")
    private TipoDespesa tipoDespesa; // Para despesas fixas (água, luz)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entrada_material_id")
    private EntradaMaterial entradaMaterial; // Para despesas de compra de materiais

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id")
    private Fornecedor fornecedor;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate dataVencimento;

    @Column
    private LocalDate dataPagamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusFinanceiro status; // PAGO, PENDENTE, ATRASADO

    @Column(columnDefinition = "TEXT")
    private String observacoes;
}

