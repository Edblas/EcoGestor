-- Criação da tabela de despesas
CREATE TABLE despesas (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_by UUID,
    active BOOLEAN NOT NULL DEFAULT true,
    tipo_despesa_id UUID,
    entrada_material_id UUID,
    cliente_id UUID,
    fornecedor_id UUID,
    descricao VARCHAR(255) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status VARCHAR(50) NOT NULL,
    observacoes TEXT,
    CONSTRAINT fk_despesa_tipo FOREIGN KEY (tipo_despesa_id) REFERENCES tipos_despesa(id),
    CONSTRAINT fk_despesa_entrada FOREIGN KEY (entrada_material_id) REFERENCES entradas_materiais(id),
    CONSTRAINT fk_despesa_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    CONSTRAINT fk_despesa_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);
