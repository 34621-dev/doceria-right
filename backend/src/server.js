const app = require('./app');
const connectDB = require('./config/db');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;

// Inicializa o servidor localmente
async function startServer(port = DEFAULT_PORT) {
  try {
    await connectDB();

    const server = app.listen(port, () => {
      console.log(`\n======================================================`);
      console.log(`🍰 Servidor da Doceria rodando com sucesso na porta ${port}!`);
      console.log(`👉 Aplicação Web (Frontend): http://localhost:${port}`);
      console.log(`👉 Endpoint da API (Doces):   http://localhost:${port}/api/doces`);
      console.log(`======================================================\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Porta ${port} já está em uso.`);
        if (port === DEFAULT_PORT) {
          console.log(`Tentando iniciar na porta alternativa ${port + 1}...`);
          startServer(port + 1);
        } else {
          console.error(`Não foi possível alocar uma porta para o servidor.`);
          process.exit(1);
        }
      } else {
        console.error('Erro no servidor HTTP:', err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Falha crítica ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

startServer();
