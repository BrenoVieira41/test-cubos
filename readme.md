<p align="center">
  <b>Teste para empresa Cubos</b><br/>
  <h4 align="center">Código desenvolvido como parte do processo seletivo da empresa Cubos.</h4>
</p>

---

### 🛠 Tecnologias utilizadas

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/?via=start&gad_source=1)

---

## 📣 Sobre o projeto

Projeto backend para gerenciamento de contas, com suporte à criação de múltiplos cartões por conta e realização de transferências internas entre usuários.

Entre as funcionalidades estão:
- Criação de contas
- Criação de cartões (físico ou virtual)
- Transferência entre usuários
- Adição de saldo
- Estorno de transações

---

## 🚀 Como rodar o projeto

### 💾 Clonando o repositório

```bash
git clone https://github.com/BrenoVieira41/test-cubos.git
cd test-cubos
```

### 🎁 Instalando as dependências

```bash
npm install
```

### 🧪 Rodando as migrations

Antes de tudo, certifique-se de criar um arquivo `.env` com as configurações do seu banco de dados.

```bash
# Rodar as migrations
npx prisma migrate dev

# Opcional: visualizar o banco com Prisma Studio
npx prisma studio
```

### ▶️ Executando o projeto

```bash
# Em ambiente de produção
npm run build
npm run start

# Em ambiente de desenvolvimento
npm run dev
```

---

## 💡 Possíveis melhorias

Listei abaixo algumas ideias que pensei durante o desenvolvimento:

- [ ] Implementar real-time ou mensageria para eventos de transferência.
- [ ] Criar agendamento de pagamentos (scheduled payments).
- [ ] Adicionar paginação na listagem de transferências estornadas.
- [ ] Incluir validações e permissões mais robustas para usuários administradores.
- [ ] Documentar a API com Swagger para facilitar testes e leitura externa.

---

Se tiver sugestões ou quiser contribuir com feedback, sinta-se à vontade!
