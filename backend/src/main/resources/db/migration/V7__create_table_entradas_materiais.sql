-- Criação da tabela de entradas de materiais
CREATE TABLE entradas_materiais (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_by UUID,
    active BOOLEAN NOT NULL DEFAULT true,
    fornecedor_id UUID NOT NULL,
    material_id UUID NOT NULL,
    movimentacao_estoque_id UUID NOT NULL,
    peso NUMERIC(10, 2) NOT NULL,
    valor_kg NUMERIC(10, 2) NOT NULL,
    valor_total NUMERIC(10, 2) NOT NULL,
    data_entrada TIMESTAMP NOT NULL,
    observacoes TEXT,
    CONSTRAINT fk_entrada_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    CONSTRAINT fk_entrada_material FOREIGN KEY (material_id) REFERENCES materiais(id),
    CONSTRAINT fk_entrada_movimentacao FOREIGN KEY (movimentacao_estoque_id) REFERENCES movimentacoes_estoque(id)
);
