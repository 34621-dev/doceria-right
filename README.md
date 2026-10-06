# 🍰 Doceria System

Mini sistema de gestão para confeitarias e docerias desenvolvido com **Node.js**, **Express**, **MongoDB** e **JavaScript Vanilla**, preparado para execução local e deploy Serverless na **Vercel**.

## 📁 Estrutura do Projeto

```
doceria/
├── vercel.json       # Configuração unificada de deploy na Vercel (Raiz)
├── package.json      # Dependências e scripts unificados
├── .gitignore        # Ignora node_modules, .env e arquivos locais
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
│   └── package.json  # Dependências e scripts do backend
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

## 🚀 Como Rodar Localmente

### Instalar dependências
```bash
npm install
```

### Rodar a aplicação (modo desenvolvimento)
```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

### Rodar os testes
```bash
npm test
```

## ☁️ Como Fazer Deploy na Vercel

1. **Repositório no GitHub**: Suba as alterações para o seu repositório no GitHub (`git push origin main`).
2. **Importar na Vercel**:
   - Conecte o repositório na Vercel.
   - Deixe o campo **Root Directory** como `./` (raiz padrão). O arquivo [`vercel.json`](./vercel.json) na raiz gerenciará automaticamente as rotas do frontend e as Serverless Functions da API.
3. **Variáveis de Ambiente na Vercel**:
   - Acesse **Settings** > **Environment Variables** no projeto da Vercel.
   - Adicione a variável `MONGODB_URI` com a connection string do seu banco MongoDB Atlas (gratuito):
     ```env
     MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/doceriadb?retryWrites=true&w=majority
     ```
4. **Deploy**: O deploy será concluído e sua aplicação estará disponível no domínio `.vercel.app` servindo tanto o frontend quanto os endpoints `/api/doces`.

## ⚙️ Configuração Local

Configure as variáveis de ambiente no arquivo `backend/.env` (ou na raiz):

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/doceriadb
NODE_ENV=development
```

> 💡 Se o MongoDB não estiver disponível em desenvolvimento local, o sistema usa automaticamente um banco em memória (`mongodb-memory-server`). Na Vercel (produção), configure a variável `MONGODB_URI`.

