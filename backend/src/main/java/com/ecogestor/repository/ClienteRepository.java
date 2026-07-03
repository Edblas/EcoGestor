package com.ecogestor.repository;

import com.ecogestor.entity.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    Optional<Cliente> findByCpfCnpj(String cpfCnpj);

    @Query("SELECT c FROM Cliente c WHERE " +
           "(:search IS NULL OR LOWER(c.nome) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.cpfCnpj) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.telefone) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND c.active = true")
    Page<Cliente> search(@Param("search") String search, Pageable pageable);
}
