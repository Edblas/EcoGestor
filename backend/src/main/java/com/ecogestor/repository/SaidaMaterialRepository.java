package com.ecogestor.repository;

import com.ecogestor.entity.SaidaMaterial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SaidaMaterialRepository extends JpaRepository<SaidaMaterial, UUID> {

    @Query("SELECT s FROM SaidaMaterial s WHERE s.active = true ORDER BY s.dataSaida DESC")
    Page<SaidaMaterial> findAllActive(Pageable pageable);

    @Query("SELECT s FROM SaidaMaterial s WHERE " +
           "(:clienteId IS NULL OR s.cliente.id = :clienteId) AND " +
           "(:materialId IS NULL OR s.material.id = :materialId) AND " +
           "s.active = true " +
           "ORDER BY s.dataSaida DESC")
    Page<SaidaMaterial> search(@Param("clienteId") UUID clienteId,
                               @Param("materialId") UUID materialId,
                               Pageable pageable);

    @Query("SELECT s FROM SaidaMaterial s WHERE s.dataSaida BETWEEN :dataInicio AND :dataFim AND s.active = true ORDER BY s.dataSaida ASC")
    List<SaidaMaterial> findByDataSaidaBetween(@Param("dataInicio") LocalDateTime dataInicio, @Param("dataFim") LocalDateTime dataFim);

    @Query("SELECT COALESCE(SUM(s.valorTotal), 0) FROM SaidaMaterial s WHERE s.active = true AND s.status = 'FINALIZADO'")
    BigDecimal calcularTotalValorSaidasFinalizadas();

    @Query("SELECT COALESCE(SUM(s.valorTotal), 0) FROM SaidaMaterial s " +
            "WHERE s.active = true AND s.status = 'FINALIZADO' " +
            "AND s.dataSaida BETWEEN :inicio AND :fim")
    BigDecimal calcularTotalValorSaidasFinalizadasPorPeriodo(@Param("inicio") LocalDateTime inicio,
                                                             @Param("fim") LocalDateTime fim);
}
