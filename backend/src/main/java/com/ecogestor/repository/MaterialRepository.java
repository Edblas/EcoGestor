package com.ecogestor.repository;

import com.ecogestor.entity.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MaterialRepository extends JpaRepository<Material, UUID> {

    @Query("SELECT m FROM Material m WHERE " +
           "(:search IS NULL OR LOWER(m.nome) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.categoria) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND m.active = true")
    Page<Material> search(@Param("search") String search, Pageable pageable);
}
