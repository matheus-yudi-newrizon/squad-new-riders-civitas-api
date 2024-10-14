# Orion Bootcamp Backend Boilerplate

Código base para o desenvolvimento do backend dos projetos do Orion Bootcamp.

## Requisitos de ambiente

- Node e NPM
- Docker e Docker Compose

## Configurações iniciais

- Alterar nome do projeto onde ele estiver como Orion (package.json, swaggerConfig, ...);

### Banco de dados

- O projeto está pré configurado para utilizar MongoDB.

Para usar o MySQL:

- Trocar a environment de CONNECTION_STRING no arquivo docker-compose.yml;
- Alterar a dbConfig usada no app.ts;
- É recomendado remover todo o bloco do banco não utilizado dos services, no arquivo docker-compose.yml, para não ter um banco rodando desnecessariamente.

## Rodando o projeto

`docker-compose up`

### Acessos

- URL base: <http://localhost:4444>
- Documentação Swagger: <http://localhost:4444/swagger>
- Banco de dados MongoDB: mongodb://orion_root:j5m966qp7jiypfda@localhost:27017
- Banco de dados MySQL: mysql://orion_root:j5m966qp7jiypfda@localhost:3306
