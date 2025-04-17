https://git.cubos.io/cubos/desafios-tecnicos/pessoa-backend-pleno/-/blob/main/endpoints/endpoints.md?ref_type=heads

uma conta de administrador... 
    - vai poder ver todos os usuarios,
        - com ou sem lsitagem
        - visualizar algum em expecifico.
    - poder ver todos os cartões, (getCards)
        - com ou sem lsitagem
        - visualizar algum em expecifico.
    - pode ver todas as transações
        - com ou sem lsitagem
        - visualizar algum em expecifico.

- criação de usuario. [POST /people]
    - name, (3 a 200 / string)
    - document, (cpf, cnpj)
    - password, (6 a 50 / string, 1 numero 1 letra maisucula, 1 minuscula, 1 simbolo)

- login. [POST /login]
    - document,
    - password,

---
- criar conta. [POST /accounts]
    - branch, (3 / string)
    - account, (9 XXXXXXX-X / string)
    - userId

- criar cartão. [POST /accounts/:accountId/cards]
    - type, (physical, virtual)
    - number, (16 / string)
    - cvv, (3 / string)
    - user_id,

- visualizar cartões. [GET /accounts/:accountId/cards] (administrador.)
    - itemsPerPage: default 10,
    - currentPage: pagina atual
    - orderby (updatedAt) asc e desc

- visualizar cartões. [GET /cards] (user.)
    - itemsPerPage: default 10,
    - currentPage: pagina atual (default 1)
    - orderby (updatedAt) asc e desc

- adicionar ou remove fundos. [POST /accounts/:accountId/transactions]
    - value (flooat)
    - accountId (url)
    - description (string)
    - type (credit, debit) "credito aumenta, debito diminui"

- transação. [POST /accounts/:accountId/transactions/internal]
    - receiverAccountId
    - accountId (url)
    - value (flooat)
    - description (string)

- lista de transações [GET /accounts/:accountId/transactions]
    - type: (credit, debit)
    - itemsPerPage: default 10,
    - currentPage: pagina atual
    - orderby (updatedAt) asc e desc

- balance. (GET /accounts/:accountId/balance)
tras o valor atual só...