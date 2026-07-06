# Debug Session: system-health-check

Status: OPEN

## Objetivo
Diagnosticar problemas atuais do sistema EcoGestor sem alterar lógica de negócio antes de coletar evidências.

## Sintomas / Contexto
- Usuário solicitou `#problems_and_diagnostics`.
- Há histórico recente de ajustes em Entradas, Saídas, Financeiro e layout.
- O sistema sobe localmente, mas pode conter falhas funcionais pontuais.

## Hipóteses Iniciais
1. Há erros funcionais pontuais em fluxos CRUD por divergência entre regras de negócio e mensagens da UI.
2. Existem avisos/erros de configuração que não quebram o build, mas podem causar comportamento inconsistente em runtime.
3. Alguns dados exibidos na UI não batem com os cálculos esperados por filtros de data/status.
4. Há diferenças entre frontend e backend em validações de Entradas/Saídas que só aparecem em uso real.
5. Pode existir regressão recente em exclusão/edição causada pelas últimas alterações de layout e ações.

## Plano de Evidência
1. Levantar diagnósticos estáticos atuais.
2. Validar build/compile.
3. Verificar estado de runtime básico.
4. Listar problemas confirmados, hipótese descartada e risco residual.

## Evidências
- `GetDiagnostics` apontou erros de MapStruct em múltiplos mappers (`FornecedorMapper`, `UserMapper`, `EntradaMaterialMapper`, `SaidaMaterialMapper`, etc.).
- `mvn -DskipTests compile` executou com `BUILD SUCCESS`.
- `npm run build` executou com sucesso no frontend.
- Há warnings Java secundários (`@Builder` em `AuthResponseDTO`, imports não usados).
- Indício atual: parte relevante dos erros exibidos no editor é inconsistente com a compilação real.

## Conclusão
- Diagnóstico parcial concluído.
- Hipótese 2 ganha força: existem diagnósticos/avisos de tooling que não representam falha real de build.
- Ainda não há evidência, nesta rodada, de erro bloqueante geral de compilação do sistema.
