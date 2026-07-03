# EcoGestor - Lógica de Negócio Completa

## Objetivo
Implementar lógica de negócio completa para uma empresa de reciclagem que:
- Compra/recebe materiais de **fornecedores E clientes**
- Vende materiais processados para clientes
- Registra todas as transações comerciais
- Mantém controle de estoque preciso

## Tarefas

### Backend
1. [ ] Modificar entidade `EntradaMaterial` para aceitar tanto `Cliente` quanto `Fornecedor`
2. [ ] Criar entidade `SaidaMaterial` (ou `Venda`) para registrar vendas/saídas para clientes
3. [ ] Criar DTOs para `SaidaMaterial`
4. [ ] Criar Service para `SaidaMaterial`
5. [ ] Criar Controller para `SaidaMaterial`
6. [ ] Criar Repository para `SaidaMaterial`
7. [ ] Atualizar `EntradaMaterialService` para funcionar com ambos (cliente e fornecedor)
8. [ ] Adicionar Flyway migration para as alterações no banco

### Frontend
1. [ ] Atualizar formulário de entrada para escolher entre Cliente e Fornecedor
2. [ ] Criar página de Saídas/Vendas
3. [ ] Criar formulário de saída de material
4. [ ] Criar tabela de saídas

## Fluxo Desejado

### Entrada de Material
1. Usuário seleciona tipo de parceiro: **Cliente** ou **Fornecedor**
2. Seleciona o parceiro (cliente ou fornecedor)
3. Seleciona o material
4. Informa peso e valor/kg
5. Sistema registra:
   - `EntradaMaterial` com dados do parceiro
   - `MovimentacaoEstoque` tipo ENTRADA
   - Atualiza saldo do estoque

### Saída/Venda de Material
1. Usuário seleciona Cliente
2. Seleciona o material
3. Informa peso e valor/kg
4. Sistema verifica se há estoque suficiente
5. Sistema registra:
   - `SaidaMaterial` (ou `Venda`) com dados do cliente
   - `MovimentacaoEstoque` tipo SAIDA
   - Atualiza saldo do estoque
