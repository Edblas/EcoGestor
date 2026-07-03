-- Inserção de tipos de despesa padrão
INSERT INTO tipos_despesa (id, created_at, updated_at, active, nome, descricao) VALUES
('550e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'ÁGUA', 'Despesa com conta de água'),
('550e8400-e29b-41d4-a716-446655440002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'LUZ', 'Despesa com conta de energia elétrica'),
('550e8400-e29b-41d4-a716-446655440003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'TELEFONE', 'Despesa com telefone e internet'),
('550e8400-e29b-41d4-a716-446655440004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'ALUGUEL', 'Despesa com aluguel de espaço'),
('550e8400-e29b-41d4-a716-446655440005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'COMBUSTÍVEL', 'Despesa com combustível para veículos'),
('550e8400-e29b-41d4-a716-446655440006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'OUTROS', 'Outras despesas não categorizadas');
