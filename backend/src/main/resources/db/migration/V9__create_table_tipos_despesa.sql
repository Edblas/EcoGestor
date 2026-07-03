-- Criação da tabela de tipos de despesa
CREATE TABLE tipos_despesa (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by UUID,
    updated_by UUID,
    active BOOLEAN NOT NULL DEFAULT true,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT
);
