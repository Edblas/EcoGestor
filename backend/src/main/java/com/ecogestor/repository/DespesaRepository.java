package com.ecogestor.repository;

import com.ecogestor.entity.Despesa;
import com.ecogestor.entity.StatusFinanceiro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface DespesaRepository extends JpaRepository<Despesa, UUID> {
    @Query("SELECT d FROM Despesa d WHERE d.active = true ORDER BY d.dataVencimento DESC")
    Page<Despesa> findAllActive(Pageable pageable);

    @Query("SELECT d FROM Despesa d WHERE " +
            "(:status IS NULL OR d.status = :status) AND " +
            "d.active = true " +
            "ORDER BY d.dataVencimento DESC")
    Page<Despesa> search(@Param("status") StatusFinanceiro status, Pageable pageable);

    @Query("SELECT d FROM Despesa d WHERE " +
            "(:status IS NULL OR d.status = :status) AND " +
            "(:inicio IS NULL OR d.dataVencimento >= :inicio) AND " +
            "(:fim IS NULL OR d.dataVencimento <= :fim) AND " +
            "d.active = true " +
            "ORDER BY d.dataVencimento DESC")
    Page<Despesa> search(@Param("status") StatusFinanceiro status,
                         @Param("inicio") LocalDate inicio,
                         @Param("fim") LocalDate fim,
                         Pageable pageable);

    @Query("SELECT COALESCE(SUM(d.valor), 0) FROM Despesa d WHERE d.active = true")
    BigDecimal calcularTotalDespesas();

    @Query("SELECT COALESCE(SUM(d.valor), 0) FROM Despesa d WHERE d.status = 'PAGO' AND d.active = true")
    BigDecimal calcularTotalPago();

    @Query("SELECT COALESCE(SUM(d.valor), 0) FROM Despesa d WHERE d.status IN ('PENDENTE', 'ATRASADO') AND d.active = true")
    BigDecimal calcularTotalPendente();

    @Query("SELECT COALESCE(SUM(d.valor), 0) FROM Despesa d WHERE d.dataVencimento >= :inicio AND d.dataVencimento <= :fim AND d.active = true")
    BigDecimal calcularTotalPorPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT COALESCE(SUM(d.valor), 0) FROM Despesa d WHERE d.status = 'PAGO' AND d.dataPagamento >= :inicio AND d.dataPagamento <= :fim AND d.active = true")
    BigDecimal calcularTotalPagoPorPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}
