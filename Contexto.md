# 📋 Contexto do Projeto - Doceria System

## 1. Visão Geral
O **Doceria System** é uma aplicação web full stack projetada como um sistema de gestão para confeitarias e docerias. O sistema permite cadastrar, visualizar, editar e remover doces com cálculo e exibição de preços formatados em Real Brasileiro (BRL), fotos e classificação por tipo (ex: Bolo, Torta, Brigadeiro, Cupcake).

---

## 2. Arquitetura e Tecnologias

### Backend
- **Runtime**: Node.js (v24.x)
- **Framework**: Express.js (v4.21.x)
- **Banco de Dados**: MongoDB via Mongoose (v8.9.x) com suporte a conexão remota (MongoDB Atlas), local e fallback automático para banco em memória (`MongoMemoryServer`) para desenvolvimento sem dependência de serviços externos instalados
- **Estratégia de Conexão**: Pooling com cache de conexão global para otimização em ambiente Serverless
- **Deploy**: Preparado para Serverless Functions na Vercel (`api/index.js` + `vercel.json`)
- **Segurança e Comunicação**: CORS habilitado para integração transparente com o frontend

### Frontend
- **Interface**: HTML5 Semântico, CSS3 Moderno (CSS Custom Properties, Flexbox, Grid)
- **Lógica e Consumo**: JavaScript Vanilla (ES6+, Fetch API, Async/Await)
- **Experiência do Usuário (UX)**: Design temático acolhedor de confeitaria, feedback por notificações (toasts), modal de confirmação para exclusão e modal para cadastro/edição com prévia da imagem em tempo real

---

## 3. Estado Atual da Aplicação

- **Fase Atual**: Etapa 8 Concluída - Projeto 100% implementado, testado e documentado.
- **Resultados de Testes**:
  - 29 asserções de testes executadas via `npm test` cobrindo GET, POST, PUT, DELETE, integridade de dados e tratamento de erros.
  - 100% de aprovação (0 falhas).
- **Estrutura de Arquivos Final**:
  ```text
  doceria/
  ├── backend/
  │   ├── api/
  │   │   └── index.js          # Ponto de entrada para Serverless Function na Vercel
  │   ├── src/
  │   │   ├── config/           # Conexão com MongoDB (Mongoose) com cache serverless
  │   │   ├── models/           # Schema do Doce (nome, tipo, preco, fotoUrl, createdAt)
  │   │   ├── controllers/      # Controllers CRUD com validação
  │   │   ├── routes/           # Rotas /api/doces
  │   │   ├── app.js            # Express app com middlewares, CORS e arquivos estáticos
  │   │   └── server.js         # Inicialização do servidor local
  │   ├── tests/
  │   │   └── api.test.js       # Testes automatizados com MongoMemoryServer e Supertest
  │   ├── .env                  # Configurações de desenvolvimento local (não commitado)
  │   ├── package.json          # Dependências e scripts
  │   └── vercel.json           # Configuração de rotas da Vercel
  ├── frontend/
  │   ├── index.html            # Interface de listagem e cadastro
  │   ├── style.css             # Estilização limpa e responsiva
  │   └── main.js               # Consumo da API via Fetch API
  ├── Roadmap.md                # Lista detalhada de etapas do desenvolvimento
  ├── Contexto.md               # Resumo do estado atual da aplicação
  └── api.md                    # Documentação dos endpoints para testes
  ```

---

## 4. Instruções de Execução

### Como rodar os testes automatizados
```bash
cd backend
npm test
```

### Como rodar o servidor localmente
1. Configure sua string do MongoDB no arquivo `backend/.env` (ou utilize MongoDB Atlas):
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/doceriadb
   ```
2. Inicie o servidor:
   ```bash
   cd backend
   npm start
   ```
3. Acesse no navegador:
   - Aplicação Frontend: `http://localhost:3000`
   - Endpoint de Doces: `http://localhost:3000/api/doces`

### Como fazer deploy na Vercel
1. Instale a Vercel CLI ou conecte o repositório GitHub à Vercel.
2. Defina a variável de ambiente `MONGODB_URI` nas configurações de projeto da Vercel (`Project Settings` > `Environment Variables`).
3. O arquivo `vercel.json` e `api/index.js` já estão configurados para redirecionar as chamadas para a Serverless Function do Express.

