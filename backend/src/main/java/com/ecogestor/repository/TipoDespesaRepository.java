package com.ecogestor.repository;

import com.ecogestor.entity.TipoDespesa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TipoDespesaRepository extends JpaRepository<TipoDespesa, UUID> {
    @Query("SELECT t FROM TipoDespesa t WHERE t.active = true ORDER BY t.nome")
    Page<TipoDespesa> findAllActive(Pageable pageable);
}

