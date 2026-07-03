-- Criação da tabela de movimentações de estoque
CREATE TABLE movimentacoes_estoque (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_by UUID,
    active BOOLEAN NOT NULL DEFAULT true,
    material_id UUID NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    peso NUMERIC(10, 2) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    data_movimentacao TIMESTAMP NOT NULL,
    usuario_id UUID,
    observacoes TEXT,
    CONSTRAINT fk_movimentacao_material FOREIGN KEY (material_id) REFERENCES materiais(id),
    CONSTRAINT fk_movimentacao_usuario FOREIGN KEY (usuario_id) REFERENCES users(id)
);
