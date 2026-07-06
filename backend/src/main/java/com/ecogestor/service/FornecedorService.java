package com.ecogestor.service;

import com.ecogestor.dto.fornecedor.FornecedorRequestDTO;
import com.ecogestor.dto.fornecedor.FornecedorResponseDTO;
import com.ecogestor.entity.Fornecedor;
import com.ecogestor.exception.CpfCnpjJaExistenteException;
import com.ecogestor.exception.ResourceNotFoundException;
import com.ecogestor.mapper.FornecedorMapper;
import com.ecogestor.repository.FornecedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FornecedorService {

    private final FornecedorRepository fornecedorRepository;
    private final FornecedorMapper fornecedorMapper;

    public FornecedorResponseDTO create(FornecedorRequestDTO dto) {
        if (fornecedorRepository.findByCpfCnpj(dto.getCpfCnpj()).isPresent()) {
            throw new CpfCnpjJaExistenteException("CPF/CNPJ já cadastrado: " + dto.getCpfCnpj());
        }

        Fornecedor fornecedor = fornecedorMapper.toEntity(dto);
        fornecedor.setActive(true);
        fornecedor = fornecedorRepository.save(fornecedor);
        return fornecedorMapper.toResponseDTO(fornecedor);
    }

    public Page<FornecedorResponseDTO> search(String search, Pageable pageable) {
        Page<Fornecedor> fornecedores = fornecedorRepository.search(search, pageable);
        return fornecedores.map(fornecedorMapper::toResponseDTO);
    }

    public FornecedorResponseDTO findById(UUID id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + id));
        return fornecedorMapper.toResponseDTO(fornecedor);
    }

    public boolean existsByCpfCnpj(String cpfCnpj) {
        return fornecedorRepository.findByCpfCnpj(cpfCnpj).isPresent();
    }

    public FornecedorResponseDTO update(UUID id, FornecedorRequestDTO dto) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + id));

        if (!fornecedor.getCpfCnpj().equals(dto.getCpfCnpj())) {
            if (fornecedorRepository.findByCpfCnpj(dto.getCpfCnpj()).isPresent()) {
                throw new CpfCnpjJaExistenteException("CPF/CNPJ já cadastrado: " + dto.getCpfCnpj());
            }
        }

        fornecedor.setNome(dto.getNome());
        fornecedor.setCpfCnpj(dto.getCpfCnpj());
        fornecedor.setTelefone(dto.getTelefone());
        fornecedor.setWhatsapp(dto.getWhatsapp());
        fornecedor.setEmail(dto.getEmail());
        fornecedor.setEndereco(dto.getEndereco());
        fornecedor.setCidade(dto.getCidade());
        fornecedor.setEstado(dto.getEstado());
        fornecedor.setCep(dto.getCep());
        fornecedor.setObservacoes(dto.getObservacoes());

        fornecedor = fornecedorRepository.save(fornecedor);
        return fornecedorMapper.toResponseDTO(fornecedor);
    }

    public void delete(UUID id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado com id: " + id));
        fornecedor.setActive(false);
        fornecedorRepository.save(fornecedor);
    }
}
