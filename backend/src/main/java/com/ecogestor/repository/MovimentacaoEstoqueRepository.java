package com.ecogestor.repository;

import com.ecogestor.entity.MovimentacaoEstoque;
import com.ecogestor.entity.TipoMovimentacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, UUID> {

    @Query("SELECT m FROM MovimentacaoEstoque m WHERE m.active = true ORDER BY m.dataMovimentacao DESC")
    Page<MovimentacaoEstoque> findAllActive(Pageable pageable);

    @Query("SELECT m FROM MovimentacaoEstoque m WHERE " +
           "(:materialId IS NULL OR m.material.id = :materialId) AND " +
           "(:tipo IS NULL OR m.tipo = :tipo) AND " +
           "m.active = true " +
           "ORDER BY m.dataMovimentacao DESC")
    Page<MovimentacaoEstoque> search(@Param("materialId") UUID materialId,
                                      @Param("tipo") TipoMovimentacao tipo,
                                      Pageable pageable);

    @Query("SELECT COALESCE(SUM(CASE WHEN m.tipo = 'ENTRADA' THEN m.peso ELSE -m.peso END), 0) " +
           "FROM MovimentacaoEstoque m WHERE m.material.id = :materialId AND m.active = true")
    java.math.BigDecimal calcularSaldoEstoque(@Param("materialId") UUID materialId);

    @Query("SELECT COUNT(m) FROM MovimentacaoEstoque m WHERE m.tipo = :tipo AND m.dataMovimentacao >= :inicioDia AND m.active = true")
    long countByTipoAndDataMovimentacaoToday(@Param("tipo") TipoMovimentacao tipo, @Param("inicioDia") LocalDateTime inicioDia);
}
