-- Criação da tabela materiais
CREATE TABLE materiais (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_by UUID,
    active BOOLEAN NOT NULL DEFAULT true,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    unidade_medida VARCHAR(50) NOT NULL,
    valor_padrao_kg NUMERIC(10, 2) NOT NULL
);
