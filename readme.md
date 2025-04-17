## 🧑‍💼 Permissões de Conta Administradora

Uma conta de administrador possui os seguintes privilégios:

- Pode visualizar **todos os usuários**:
  - Com ou sem paginação.
  - Pode visualizar um usuário específico.

- Pode visualizar **todos os cartões** (`GET /cards`):
  - Com ou sem paginação.
  - Pode visualizar um cartão específico.

- Pode visualizar **todas as transações**:
  - Com ou sem paginação.
  - Pode visualizar uma transação específica.

---

## 👤 Criação de Usuário

**[POST /people]**

Campos obrigatórios:
- `name` – string, entre 3 e 200 caracteres.
- `document` – CPF ou CNPJ válidos.
- `password` – string entre 6 e 50 caracteres, contendo:
  - pelo menos 1 número,
  - 1 letra maiúscula,
  - 1 letra minúscula,
  - 1 símbolo.

---

## 🔐 Login

**[POST /login]**

Campos obrigatórios:
- `document`
- `password`

---

## 🏦 Criar Conta

**[POST /accounts]**

Campos obrigatórios:
- `branch` – string com exatamente 3 dígitos.
- `account` – string no formato 9 dígitos (ex: `XXXXXXX-X`).
- `userId` – ID do usuário.

---

## 💳 Criar Cartão

**[POST /accounts/:accountId/cards]**

Campos obrigatórios:
- `type` – `physical` ou `virtual`.
- `number` – string com 16 dígitos.
- `cvv` – string com 3 dígitos.
- `user_id` – ID do usuário.

---

## 📋 Visualizar Cartões (Administrador)

**[GET /accounts/:accountId/cards]**

Query params:
- `itemsPerPage` – padrão: 10.
- `currentPage` – página atual.
- `orderBy` – ordenação por `updatedAt` (`asc` ou `desc`).

---

## 📋 Visualizar Cartões (Usuário)

**[GET /cards]**

Query params:
- `itemsPerPage` – padrão: 10.
- `currentPage` – página atual (padrão: 1).
- `orderBy` – ordenação por `updatedAt` (`asc` ou `desc`).

---

## 💰 Adicionar ou Remover Fundos

**[POST /accounts/:accountId/transactions]**

Campos obrigatórios:
- `value` – número (float).
- `accountId` – passado pela URL.
- `description` – string.
- `type` – `credit` (aumenta o saldo) ou `debit` (diminui o saldo).

---

## 🔁 Transferência Interna

**[POST /accounts/:accountId/transactions/internal]**

Campos obrigatórios:
- `receiverAccountId` – conta destino.
- `accountId` – conta origem (via URL).
- `value` – número (float).
- `description` – string.

---

## 📄 Lista de Transações

**[GET /accounts/:accountId/transactions]**

Query params:
- `type` – `credit` ou `debit`.
- `itemsPerPage` – padrão: 10.
- `currentPage` – página atual.
- `orderBy` – ordenação por `updatedAt` (`asc` ou `desc`).

---

## 💼 Saldo

**[GET /accounts/:accountId/balance]**

Retorna o saldo atual da conta.

---
