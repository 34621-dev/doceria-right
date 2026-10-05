# 🍰 Doceria System

Mini sistema de gestão para confeitarias e docerias desenvolvido com **Node.js**, **Express**, **MongoDB** e **JavaScript Vanilla**, preparado para execução local e deploy Serverless na **Vercel**.

## 📁 Estrutura do Projeto

```
doceria/
├── backend/          # API REST (Express + Mongoose)
│   ├── api/          # Ponto de entrada Serverless (Vercel)
│   ├── src/
│   │   ├── config/   # Conexão MongoDB + Seed
│   │   ├── models/   # Schema do Doce
│   │   ├── controllers/  # CRUD com validação
│   │   ├── routes/   # Rotas /api/doces
│   │   ├── app.js    # Express app + middlewares
│   │   └── server.js # Inicialização local
│   ├── tests/        # Testes automatizados
│   ├── .env          # Variáveis de ambiente (não commitado)
│   ├── package.json  # Dependências e scripts
│   └── vercel.json   # Config de deploy Vercel
├── frontend/         # Interface Web (HTML + CSS + JS Vanilla)
│   ├── index.html
│   ├── style.css
│   └── main.js
├── Contexto.md       # Resumo do estado da aplicação
├── Roadmap.md        # Etapas de desenvolvimento
├── api.md            # Documentação dos endpoints
└── README.md
```

## 📖 Documentação

- 🗺️ **Roadmap**: [`Roadmap.md`](./Roadmap.md)
- 📋 **Contexto da Aplicação**: [`Contexto.md`](./Contexto.md)
- 📖 **Documentação da API**: [`api.md`](./api.md)

## 🚀 Como Rodar

### Instalar dependências
```bash
cd backend
npm install
```

### Rodar a aplicação (modo desenvolvimento)
```bash
cd backend
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

### Rodar os testes
```bash
cd backend
npm test
```

## ⚙️ Configuração

Configure as variáveis de ambiente no arquivo `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/doceriadb
NODE_ENV=development
```

> 💡 Se o MongoDB não estiver disponível, o sistema usa automaticamente um banco em memória para desenvolvimento.
