-- Criação da tabela de receitas
CREATE TABLE receitas (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_by UUID,
    active BOOLEAN NOT NULL DEFAULT true,
    saida_material_id UUID,
    cliente_id UUID,
    descricao VARCHAR(255) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    data_recebimento DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    observacoes TEXT,
    CONSTRAINT fk_receita_saida FOREIGN KEY (saida_material_id) REFERENCES saidas_materiais(id),
    CONSTRAINT fk_receita_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
