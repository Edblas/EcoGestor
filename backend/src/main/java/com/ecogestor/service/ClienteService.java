package com.ecogestor.service;

import com.ecogestor.dto.cliente.ClienteRequestDTO;
import com.ecogestor.dto.cliente.ClienteResponseDTO;
import com.ecogestor.entity.Cliente;
import com.ecogestor.exception.CpfCnpjJaExistenteException;
import com.ecogestor.exception.ResourceNotFoundException;
import com.ecogestor.mapper.ClienteMapper;
import com.ecogestor.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    public ClienteResponseDTO create(ClienteRequestDTO dto) {
        if (clienteRepository.findByCpfCnpj(dto.getCpfCnpj()).isPresent()) {
            throw new CpfCnpjJaExistenteException("CPF/CNPJ já cadastrado: " + dto.getCpfCnpj());
        }

        Cliente cliente = clienteMapper.toEntity(dto);
        cliente.setActive(true);
        cliente = clienteRepository.save(cliente);
        return clienteMapper.toResponseDTO(cliente);
    }

    public Page<ClienteResponseDTO> search(String search, Pageable pageable) {
        Page<Cliente> clientes = clienteRepository.search(search, pageable);
        return clientes.map(clienteMapper::toResponseDTO);
    }

    public ClienteResponseDTO findById(UUID id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
        return clienteMapper.toResponseDTO(cliente);
    }

    public ClienteResponseDTO update(UUID id, ClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));

        if (!cliente.getCpfCnpj().equals(dto.getCpfCnpj())) {
            if (clienteRepository.findByCpfCnpj(dto.getCpfCnpj()).isPresent()) {
                throw new CpfCnpjJaExistenteException("CPF/CNPJ já cadastrado: " + dto.getCpfCnpj());
            }
        }

        cliente.setNome(dto.getNome());
        cliente.setCpfCnpj(dto.getCpfCnpj());
        cliente.setTelefone(dto.getTelefone());
        cliente.setWhatsapp(dto.getWhatsapp());
        cliente.setEmail(dto.getEmail());
        cliente.setEndereco(dto.getEndereco());
        cliente.setCidade(dto.getCidade());
        cliente.setEstado(dto.getEstado());
        cliente.setCep(dto.getCep());
        cliente.setObservacoes(dto.getObservacoes());

        cliente = clienteRepository.save(cliente);
        return clienteMapper.toResponseDTO(cliente);
    }

    public void delete(UUID id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
        cliente.setActive(false);
        clienteRepository.save(cliente);
    }
}
