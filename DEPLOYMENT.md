# Implantacao em Producao

## Recomendacao

Para vender o EcoGestor para uso diario, a melhor estrategia e instalar o sistema em um servidor centralizado da empresa, nao nos computadores dos usuarios.

Ambiente recomendado:

- Ubuntu Server 22.04 LTS ou 24.04 LTS
- Docker Engine
- Docker Compose
- DNS interno ou externo apontando para o servidor
- Rotina de backup do PostgreSQL

## Estrutura de producao

Este projeto passa a ter uma trilha dedicada para producao:

- `docker-compose.prod.yml`
- `.env.production.example`
- `backend/src/main/resources/application-prod.properties`
- `backend/Dockerfile`
- `frontend/Dockerfile`

## O que sobe em producao

- `postgres`: banco de dados persistente
- `backend`: API Spring Boot com perfil `prod`
- `frontend`: build React servido por Nginx

Os usuarios acessam apenas o frontend pelo navegador. O frontend encaminha as chamadas `/api` para o backend internamente.

## Passo a passo

### 1. Instalar Docker no servidor

Instale Docker e Docker Compose no servidor da empresa.

### 2. Copiar o projeto

Copie a pasta do projeto para o servidor, por exemplo:

```bash
mkdir -p /opt/ecogestor
cd /opt/ecogestor
```

### 3. Criar o arquivo de ambiente

Na raiz do projeto:

```bash
cp .env.production.example .env.production
```

Depois edite o arquivo:

```bash
nano .env.production
```

Altere obrigatoriamente:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `FRONTEND_PORT` se a empresa usar outra porta

Para gerar um JWT seguro:

```bash
openssl rand -base64 32
```

### 4. Subir o sistema

Na raiz do projeto:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

### 5. Validar os containers

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production ps
```

### 6. Acessar o sistema

Se `FRONTEND_PORT=80`, acesse:

```text
http://IP-DO-SERVIDOR
```

Se quiser publicar com dominio:

```text
http://ecogestor.empresa.local
```

## Operacao

### Ver logs

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production logs -f
```

### Reiniciar o ambiente

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production restart
```

### Parar o ambiente

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production down
```

## Atualizacao de versao

Quando houver nova versao:

```bash
git pull
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

## Backup do banco

Exemplo de backup manual:

```bash
docker exec -t ecogestor-db pg_dump -U ecogestor -d ecogestor > backup-ecogestor.sql
```

Para restaurar:

```bash
cat backup-ecogestor.sql | docker exec -i ecogestor-db psql -U ecogestor -d ecogestor
```

## Recomendacoes para cliente final

- Usar senha forte no PostgreSQL
- Trocar a senha do usuario administrador apos implantacao
- Configurar backup diario
- Colocar o servidor em nobreak se for ambiente local
- Publicar via HTTPS com Nginx Proxy Manager, Nginx ou Traefik
- Restringir acesso SSH apenas para administracao

## Observacoes importantes

- O `docker-compose.yml` atual pode continuar sendo usado no desenvolvimento local.
- O arquivo `docker-compose.prod.yml` e a trilha recomendada para cliente final.
- O backend em producao usa o perfil Spring `prod`.
- O frontend de producao usa `/api` no mesmo dominio, evitando ajuste manual de CORS no navegador do usuario.
