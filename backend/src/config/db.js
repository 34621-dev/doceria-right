const mongoose = require('mongoose');

/**
 * Conexão com MongoDB com cache para Serverless (Vercel)
 * e fallback automático para MongoMemoryServer caso o serviço
 * local do MongoDB não esteja instalado/rodando.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, memoryServer: null };
}

async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const uri = process.env.MONGODB_URI;

      const connectWithUri = async (targetUri, timeout = 3000) => {
        return mongoose.connect(targetUri, {
          bufferCommands: false,
          serverSelectionTimeoutMS: timeout,
        });
      };

      // 1. Tenta conectar à URI fornecida nas variáveis de ambiente
      if (uri) {
        try {
          const isLocal = uri.includes('127.0.0.1') || uri.includes('localhost');
          const instance = await connectWithUri(uri, isLocal ? 2000 : 10000);
          console.log('🍃 MongoDB conectado com sucesso!');
          return instance;
        } catch (err) {
          // Se for ambiente de produção (Vercel), propaga o erro de conexão do cluster
          if (process.env.NODE_ENV === 'production') {
            console.error('❌ Erro na conexão com o MongoDB de produção:', err.message);
            throw err;
          }
          console.warn(`⚠️ Não foi possível conectar ao MongoDB local em ${uri} (${err.message}).`);
        }
      }

      // 2. Fallback automático para desenvolvimento: inicializa MongoMemoryServer
      try {
        console.log('🚀 Inicializando banco de dados MongoDB em memória para desenvolvimento...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        if (!cached.memoryServer) {
          cached.memoryServer = await MongoMemoryServer.create();
        }
        const memoryUri = cached.memoryServer.getUri();
        process.env.MONGODB_URI = memoryUri;

        const instance = await connectWithUri(memoryUri, 5000);
        console.log('🍃 MongoDB em memória conectado com sucesso!');

        // Popula com dados de exemplo se o banco estiver vazio
        const { seedDocesSeVazio } = require('./seed');
        await seedDocesSeVazio();

        return instance;
      } catch (fallbackErr) {
        console.error('❌ Falha ao inicializar o banco de dados em memória:', fallbackErr.message);
        throw fallbackErr;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

module.exports = connectDB;
