const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const doceRoutes = require('./routes/doceRoutes');

const app = express();

// Middlewares
const corsOrigin = process.env.NODE_ENV === 'production' && process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN
  : '*';

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend se acessado localmente
const frontendPath = path.join(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// Rota raiz da API para verificação de status
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'online',
    mensagem: 'API do Doceria System ativa e pronta para receber pedidos! 🍰',
    endpoints: {
      doces: '/api/doces'
    }
  });
});

// Rotas principais
app.use('/api/doces', doceRoutes);

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    erro: `A rota '${req.originalUrl}' não foi encontrada na API.`
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(err.status || 500).json({
    erro: 'Erro interno do servidor.',
    detalhes: process.env.NODE_ENV !== 'production' ? err.message : undefined
  });
});

module.exports = app;
