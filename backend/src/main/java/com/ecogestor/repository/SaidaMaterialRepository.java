package com.ecogestor.repository;

import com.ecogestor.entity.SaidaMaterial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}
