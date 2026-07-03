package com.ecogestor.repository;

import com.ecogestor.entity.EntradaMaterial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EntradaMaterialRepository extends JpaRepository<EntradaMaterial, UUID> {

    @Query("SELECT e FROM EntradaMaterial e WHERE e.active = true ORDER BY e.dataEntrada DESC")
    Page<EntradaMaterial> findAllActive(Pageable pageable);

    @Query("SELECT e FROM EntradaMaterial e WHERE " +
           "(:clienteId IS NULL OR e.cliente.id = :clienteId) AND " +
           "(:fornecedorId IS NULL OR e.fornecedor.id = :fornecedorId) AND " +
           "(:materialId IS NULL OR e.material.id = :materialId) AND " +
           "e.active = true " +
           "ORDER BY e.dataEntrada DESC")
    Page<EntradaMaterial> search(@Param("clienteId") UUID clienteId,
                                 @Param("fornecedorId") UUID fornecedorId,
                                 @Param("materialId") UUID materialId,
                                 Pageable pageable);
}
