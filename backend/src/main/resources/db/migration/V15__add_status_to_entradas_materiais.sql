ALTER TABLE entradas_materiais ADD COLUMN status VARCHAR(20);

UPDATE entradas_materiais
SET status = 'FINALIZADO'
WHERE status IS NULL;

ALTER TABLE entradas_materiais ALTER COLUMN status SET NOT NULL;
ALTER TABLE entradas_materiais ALTER COLUMN movimentacao_estoque_id DROP NOT NULL;
