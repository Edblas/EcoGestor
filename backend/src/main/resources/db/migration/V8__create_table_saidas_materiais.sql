-- Criação da tabela de saídas de materiais
CREATE TABLE saidas_materiais (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_by UUID,
    active BOOLEAN NOT NULL DEFAULT true,
    cliente_id UUID NOT NULL,
    material_id UUID NOT NULL,
    movimentacao_estoque_id UUID NOT NULL,
    peso NUMERIC(10, 2) NOT NULL,
    valor_kg NUMERIC(10, 2) NOT NULL,
    valor_total NUMERIC(10, 2) NOT NULL,
    data_saida TIMESTAMP NOT NULL,
    observacoes TEXT,
    CONSTRAINT fk_saida_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    CONSTRAINT fk_saida_material FOREIGN KEY (material_id) REFERENCES materiais(id),
    CONSTRAINT fk_saida_movimentacao FOREIGN KEY (movimentacao_estoque_id) REFERENCES movimentacoes_estoque(id)
);
