package com.ecogestor.repository;

import com.ecogestor.entity.Fornecedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, UUID> {

    Optional<Fornecedor> findByCpfCnpj(String cpfCnpj);

    @Query("SELECT f FROM Fornecedor f WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(f.nome) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.cpfCnpj) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(f.telefone) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND f.active = true")
    Page<Fornecedor> search(@Param("search") String search, Pageable pageable);
}
