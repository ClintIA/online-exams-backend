# SaaS Medical Exam Management System

Este repositório contém o código para um sistema de gerenciamento de exames médicos desenvolvido em Node.js usando TypeScript e TypeORM. O sistema é projetado como uma aplicação White Label, permitindo que múltiplos clientes utilizem o sistema de forma isolada.

## Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **TypeORM**
- **Express**
- **PostgreSQL**

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repo.git
   cd nome-do-repo
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

   ou

   ```bash
   yarn install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:

   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=seu-usuario
   DB_PASSWORD=sua-senha
   DB_NAME=nome-do-banco
   JWT_SECRET=sua-chave-secreta-jwt
   ```

4. Inicialize o banco de dados:
   ```bash
   npm run start
   ```
   ou
   ```bash
   yarn start
   ```

## Uso

Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

ou

```bash
yarn dev
```

O servidor estará disponível em `http://localhost:3000`.

## Estrutura de Pastas

```plaintext
src/
├── config/               # Configurações do banco de dados
├── controllers/          # Controladores das rotas
├── middlewares/          # Middlewares de autenticação e autorização
├── models/               # Modelos do banco de dados
├── routes/               # Definições das rotas
├── services/             # Lógica de negócios
└── utils/                # Funções utilitárias
```
