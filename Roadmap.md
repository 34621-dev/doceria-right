# 🗺️ Roadmap de Desenvolvimento - Doceria System

Este documento acompanha as etapas de planejamento, implementação, testes e deploy do sistema de gestão da **Doceria**.

---

## 📌 Progresso Geral: [ 8 / 8 Concluído (100%) ] ✅

- [x] **Etapa 1: Planejamento e Criação das Documentações Iniciais**
  - [x] Definição de arquitetura de pastas e padrões de código
  - [x] Criação do `Roadmap.md`
  - [x] Criação do `Contexto.md`
  - [x] Criação do `api.md` com especificação completa dos contratos REST

- [x] **Etapa 2: Estrutura do Backend e Dependências**
  - [x] Inicialização do `backend/package.json` com scripts (`start`, `dev`, `test`)
  - [x] Instalação e configuração de dependências (`express`, `mongoose`, `cors`, `dotenv`)
  - [x] Configuração dos arquivos de variáveis de ambiente (`.env.example` e `.env`)

- [x] **Etapa 3: Banco de Dados e Modelagem (MongoDB + Mongoose)**
  - [x] Implementação de `backend/src/config/db.js` com cache de conexão para Serverless
  - [x] Criação do Schema do Doce em `backend/src/models/Doce.js` (`nome`, `tipo`, `preco`, `fotoUrl`, `createdAt`) com validações

- [x] **Etapa 4: Controladores e Rotas CRUD da API**
  - [x] Criação dos métodos no controller `backend/src/controllers/doceController.js`:
    - `listarDoces` (GET /api/doces)
    - `obterDocePorId` (GET /api/doces/:id)
    - `criarDoce` (POST /api/doces)
    - `atualizarDoce` (PUT /api/doces/:id)
    - `deletarDoce` (DELETE /api/doces/:id)
  - [x] Definição e amarração de rotas em `backend/src/routes/doceRoutes.js`
  - [x] Criação da aplicação Express central em `backend/src/app.js`

- [x] **Etapa 5: Adaptação Serverless para Vercel**
  - [x] Criação do ponto de entrada serverless `backend/api/index.js`
  - [x] Configuração do `backend/vercel.json` com rewrites e headers CORS

- [x] **Etapa 6: Desenvolvimento do Frontend (HTML, CSS, JS Vanilla)**
  - [x] Criação do layout semântico em `frontend/index.html` (header, cards grid, modal de cadastro/edição, modal de exclusão, feedback/toasts)
  - [x] Estilização visual em `frontend/style.css` (tema acolhedor de doceria, responsividade, estados de hover)
  - [x] Implementação da lógica em `frontend/main.js` (Fetch API, formatação de moeda BRL, validação de campos, preview de imagem, CRUD reativo)

- [x] **Etapa 7: Testes Automatizados e Validação dos Endpoints**
  - [x] Criação do script de testes automatizados `backend/tests/api.test.js`
  - [x] Execução e validação dos 4 verbos HTTP (GET, POST, PUT, DELETE) e tratamento de erros
  - [x] 29/29 asserções aprovadas com sucesso via `npm test`

- [x] **Etapa 8: Finalização e Revisão da Documentação**
  - [x] Atualização completa do `Roadmap.md`
  - [x] Atualização do `Contexto.md` com instruções de execução local e deploy na Vercel
  - [x] Revisão do `api.md`
