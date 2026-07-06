package com.ecogestor.repository;

import com.ecogestor.entity.Receita;
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
public interface ReceitaRepository extends JpaRepository<Receita, UUID> {
    @Query("SELECT r FROM Receita r WHERE r.active = true ORDER BY r.dataRecebimento DESC")
    Page<Receita> findAllActive(Pageable pageable);

    @Query("SELECT r FROM Receita r WHERE " +
            "(:status IS NULL OR r.status = :status) AND " +
            "r.active = true " +
            "ORDER BY r.dataRecebimento DESC")
    Page<Receita> search(@Param("status") StatusFinanceiro status, Pageable pageable);

    @Query("SELECT r FROM Receita r WHERE " +
            "(:status IS NULL OR r.status = :status) AND " +
            "(:inicio IS NULL OR r.dataRecebimento >= :inicio) AND " +
            "(:fim IS NULL OR r.dataRecebimento <= :fim) AND " +
            "r.active = true " +
            "ORDER BY r.dataRecebimento DESC")
    Page<Receita> search(@Param("status") StatusFinanceiro status,
                         @Param("inicio") LocalDate inicio,
                         @Param("fim") LocalDate fim,
                         Pageable pageable);

    @Query("SELECT COALESCE(SUM(r.valor), 0) FROM Receita r WHERE r.active = true")
    BigDecimal calcularTotalReceitas();

    @Query("SELECT COALESCE(SUM(r.valor), 0) FROM Receita r WHERE r.status = 'RECEBIDO' AND r.active = true")
    BigDecimal calcularTotalRecebido();

    @Query("SELECT COALESCE(SUM(r.valor), 0) FROM Receita r WHERE r.status IN ('PENDENTE', 'ATRASADO') AND r.active = true")
    BigDecimal calcularTotalPendente();

    @Query("SELECT COALESCE(SUM(r.valor), 0) FROM Receita r WHERE r.dataRecebimento >= :inicio AND r.dataRecebimento <= :fim AND r.active = true")
    BigDecimal calcularTotalPorPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT COALESCE(SUM(r.valor), 0) FROM Receita r WHERE r.status = 'RECEBIDO' AND r.dataRecebimento >= :inicio AND r.dataRecebimento <= :fim AND r.active = true")
    BigDecimal calcularTotalRecebidoPorPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}
