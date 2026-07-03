-- Inserção do usuário ADMIN padrão
-- Senha: admin123
INSERT INTO users (id, created_at, updated_at, active, name, email, password, role)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    true,
    'Administrador',
    'admin@ecogestor.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH',
    'ADMIN'
);
