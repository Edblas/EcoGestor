# Instalacao Windows para Cliente

## Objetivo

Este guia instala o EcoGestor na maquina do cliente para uso local, com acesso facil pelo navegador e scripts simples para operacao do dia a dia.

## Requisitos

- Windows 10 ou Windows 11
- Docker Desktop instalado e em execucao
- 8 GB de RAM recomendados
- Pelo menos 10 GB livres em disco

## Arquivos principais

- `docker-compose.prod.yml`
- `.env.production.example`
- `scripts/windows/instalar-ecogestor.bat`
- `scripts/windows/iniciar-ecogestor.bat`
- `scripts/windows/parar-ecogestor.bat`
- `scripts/windows/abrir-ecogestor.bat`
- `scripts/windows/backup-ecogestor.bat`
- `scripts/windows/criar-atalho-ecogestor.bat`

## Passo a passo

### 1. Copiar o projeto

Copie a pasta do projeto para um local fixo, por exemplo:

```text
C:\EcoGestor
```

Evite instalar dentro de `Downloads` ou da area de trabalho.

### 2. Instalacao simplificada

Execute:

```text
scripts\windows\instalar-ecogestor.bat
```

Esse instalador:

- cria o `.env.production` se ele ainda nao existir
- pede a senha do banco
- define a porta de acesso
- gera o `JWT_SECRET` automaticamente
- sobe os containers
- cria o atalho real `EcoGestor ERP` na area de trabalho

### 3. Ajuste manual opcional do arquivo de configuracao

Se voce quiser revisar a configuracao depois, edite:

```text
.env.production
```

Os campos mais importantes sao:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `FRONTEND_PORT`

## 4. Primeira inicializacao

Abra:

```text
scripts\windows\iniciar-ecogestor.bat
```

Esse script:

- sobe o banco PostgreSQL
- sobe o backend
- sobe o frontend
- abre o sistema no navegador

Na primeira vez pode demorar alguns minutos.

## 5. Criar acesso facil

Depois da primeira inicializacao, execute:

```text
scripts\windows\criar-atalho-ecogestor.bat
```

Isso cria um atalho real do Windows `EcoGestor ERP` na area de trabalho do cliente.

## Uso diario

### Abrir o sistema

Forma mais simples:

```text
EcoGestor ERP.bat
```

Esse arquivo:

- instala na primeira vez, se ainda nao existir `.env.production`
- inicia os containers
- abre o sistema no navegador automaticamente

Ou, se os containers ja estiverem rodando:

```text
scripts\windows\abrir-ecogestor.bat
```

Ou use o atalho da area de trabalho.

### Abrir somente no navegador

Se os containers ja estiverem rodando:

```text
scripts\windows\abrir-ecogestor.bat
```

### Iniciar o sistema

Se o sistema estiver parado:

```text
scripts\windows\instalar-ecogestor.bat
```

ou:

```text
scripts\windows\iniciar-ecogestor.bat
```

### Parar o sistema

```text
scripts\windows\parar-ecogestor.bat
```

### Fazer backup

```text
scripts\windows\backup-ecogestor.bat
```

Os backups ficam na pasta:

```text
backups\
```

## Recomendacoes de entrega

- Deixe o projeto em `C:\EcoGestor`
- Crie o atalho na area de trabalho
- Teste login e navegacao basica
- Entregue ao cliente um usuario administrador com senha provisoria
- Oriente a trocar a senha apos a entrega

## Acesso do cliente

Por padrao, o sistema abre em:

```text
http://localhost
```

Se a porta for alterada no `.env.production`, os scripts usam a nova porta automaticamente.

## Observacoes

- O Docker Desktop precisa estar aberto para o sistema funcionar.
- Se o cliente reiniciar o computador, basta abrir `iniciar-ecogestor.bat` novamente.
- Para deixar ainda mais simples, voce pode configurar o Docker Desktop para iniciar com o Windows.
