package com.ecogestor.mapper;

import com.ecogestor.dto.financeiro.DespesaResponseDTO;
import com.ecogestor.entity.Despesa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DespesaMapper {

    @Mapping(target = "tipoDespesaId", source = "tipoDespesa.id")
    @Mapping(target = "tipoDespesaNome", source = "tipoDespesa.nome")
    @Mapping(target = "entradaMaterialId", source = "entradaMaterial.id")
    @Mapping(target = "clienteId", source = "cliente.id")
    @Mapping(target = "clienteNome", source = "cliente.nome")
    @Mapping(target = "fornecedorId", source = "fornecedor.id")
    @Mapping(target = "fornecedorNome", source = "fornecedor.nome")
    DespesaResponseDTO toResponseDTO(Despesa entity);
}
