/**
 * Suíte de Testes Automatizados da API REST - Doceria System
 * Executa validações em todos os endpoints: GET, POST, PUT, DELETE
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;
let doceCriadoId;

const ANSI_GREEN = '\x1b[32m';
const ANSI_RED = '\x1b[31m';
const ANSI_CYAN = '\x1b[36m';
const ANSI_BOLD = '\x1b[1m';
const ANSI_RESET = '\x1b[0m';

let totalTestes = 0;
let testesPassaram = 0;
let testesFalharam = 0;

function assert(condicao, descricao) {
  totalTestes++;
  if (condicao) {
    testesPassaram++;
    console.log(`  ${ANSI_GREEN}✔${ANSI_RESET} ${descricao}`);
  } else {
    testesFalharam++;
    console.error(`  ${ANSI_RED}✖ FALHA:${ANSI_RESET} ${descricao}`);
  }
}

async function executarTestes() {
  console.log(`\n${ANSI_BOLD}${ANSI_CYAN}====================================================${ANSI_RESET}`);
  console.log(`${ANSI_BOLD}🧪 INICIANDO BATERIA DE TESTES - DOCERIA REST API${ANSI_RESET}`);
  console.log(`${ANSI_BOLD}${ANSI_CYAN}====================================================${ANSI_RESET}\n`);

  try {
    // 1. Inicializa servidor MongoDB em memória para testes isolados
    console.log('📦 Inicializando banco de dados em memória para testes...');
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();

    // Importa app após configurar a URI
    app = require('../src/app');

    // ----------------------------------------------------
    // TESTE 1: Rota Raiz / Status
    // ----------------------------------------------------
    console.log(`\n${ANSI_BOLD}1. Verificação de Saúde da API (GET /api)${ANSI_RESET}`);
    const resStatus = await request(app).get('/api');
    assert(resStatus.statusCode === 200, 'Endpoint /api retorna status 200 OK');
    assert(resStatus.body.status === 'online', 'Corpo da resposta confirma status "online"');

    // ----------------------------------------------------
    // TESTE 2: Listar doces vazio inicialmente
    // ----------------------------------------------------
    console.log(`\n${ANSI_BOLD}2. Listagem Inicial de Doces (GET /api/doces)${ANSI_RESET}`);
    const resListagemInicial = await request(app).get('/api/doces');
    assert(resListagemInicial.statusCode === 200, 'GET /api/doces retorna status 200 OK');
    assert(Array.isArray(resListagemInicial.body), 'Resposta de listagem é um Array');
    assert(resListagemInicial.body.length === 0, 'Lista inicial está vazia no banco limpo');

    // ----------------------------------------------------
    // TESTE 3: Cadastrar doce com sucesso (POST /api/doces)
    // ----------------------------------------------------
    console.log(`\n${ANSI_BOLD}3. Cadastro de Novo Doce (POST /api/doces)${ANSI_RESET}`);
    const novoDoce = {
      nome: 'Bolo Vulcão de Ninho com Nutella',
      tipo: 'Bolo',
      preco: 28.50,
      fotoUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'
    };

    const resCriacao = await request(app)
      .post('/api/doces')
      .send(novoDoce);

    assert(resCriacao.statusCode === 201, 'POST /api/doces retorna status 201 Created');
    assert(resCriacao.body.doce !== undefined, 'Resposta contém o objeto do doce criado');
    assert(resCriacao.body.doce.nome === novoDoce.nome, 'Nome gravado confere com o enviado');
    assert(resCriacao.body.doce.preco === 28.50, 'Preço numérico confere');
    assert(Boolean(resCriacao.body.doce._id), 'Doce possui identificador _id gerado pelo MongoDB');

    doceCriadoId = resCriacao.body.doce._id;

    // ----------------------------------------------------
    // TESTE 4: Validação de campos obrigatórios no cadastro
    // ----------------------------------------------------
    console.log(`\n${ANSI_BOLD}4. Validação de Erros no Cadastro (POST /api/doces)${ANSI_RESET}`);
    const resInvalidoSemNome = await request(app)
      .post('/api/doces')
      .send({ tipo: 'Bolo', preco: 10, fotoUrl: 'https://exemplo.com/foto.jpg' });

    assert(resInvalidoSemNome.statusCode === 400, 'Rejeita cadastro sem nome com status 400 Bad Request');
    assert(Boolean(resInvalidoSemNome.body.erro), 'Retorna mensagem descritiva de erro');

    const resPrecoNegativo = await request(app)
      .post('/api/doces')
      .send({ nome: 'Torta de Limão', tipo: 'Torta', preco: -5, fotoUrl: 'https://exemplo.com/foto.jpg' });

    assert(resPrecoNegativo.statusCode === 400, 'Rejeita cadastro com preço negativo com status 400');

    // ----------------------------------------------------
    // TESTE 5: Listar doces após cadastro
    // ----------------------------------------------------
    console.log(`\n${ANSI_BOLD}5. Listagem com Doces Cadastrados (GET /api/doces)${ANSI_RESET}`);
    const resListagem = await request(app).get('/api/doces');
    assert(resListagem.statusCode === 200, 'GET /api/doces retorna 200 OK');
    assert(resListagem.body.length === 1, 'Array de doces contém exatamente 1 item');
    assert(resListagem.body[0]._id === doceCriadoId, 'Item na listagem possui o ID do doce criado');

    // ----------------------------------------------------
    // TESTE 6: Buscar doce por ID
    // ----------------------------------------------------
    console.log(`\n${ANSI_BOLD}6. Obter Doce por ID (GET /api/doces/:id)${ANSI_RESET}`);
    const resBuscarPorId = await request(app).get(`/api/doces/${doceCriadoId}`);
    assert(resBuscarPorId.statusCode === 200, 'GET /api/doces/:id com ID existente retorna 200 OK');
    assert(resBuscarPorId.body.nome === novoDoce.nome, 'Dados retornados conferem com o doce');

    const resIdInvalido = await request(app).get('/api/doces/id-invalido-123');
    assert(resIdInvalido.statusCode === 400, 'GET com ID malformatado retorna status 400 Bad Request');

    const idInexistente = new mongoose.Types.ObjectId();
    const resNaoEncontrado = await request(app).get(`/api/doces/${idInexistente}`);
    assert(resNaoEncontrado.statusCode === 404, 'GET com ID inexistente retorna status 404 Not Found');

    // ----------------------------------------------------
    // TESTE 7: Atualizar doce existente (PUT /api/doces/:id)
    // ----------------------------------------------------
    console.log(`\n${ANSI_BOLD}7. Atualizar Doce (PUT /api/doces/:id)${ANSI_RESET}`);
    const alteracoes = {
      nome: 'Bolo Vulcão de Ninho com Morango Fresco',
      preco: 32.00
    };

    const resAtualizacao = await request(app)
      .put(`/api/doces/${doceCriadoId}`)
      .send(alteracoes);

    assert(resAtualizacao.statusCode === 200, 'PUT /api/doces/:id retorna status 200 OK');
    assert(resAtualizacao.body.doce.nome === alteracoes.nome, 'Nome foi devidamente alterado');
    assert(resAtualizacao.body.doce.preco === 32.00, 'Preço foi devidamente alterado');
    assert(resAtualizacao.body.doce.tipo === 'Bolo', 'Campo não informado permaneceu inalterado');

    const resPutInvalido = await request(app)
      .put(`/api/doces/${doceCriadoId}`)
      .send({ preco: -10 });

    assert(resPutInvalido.statusCode === 400, 'PUT com preço negativo retorna status 400 Bad Request');

    // ----------------------------------------------------
    // TESTE 8: Remover doce (DELETE /api/doces/:id)
    // ----------------------------------------------------
    console.log(`\n${ANSI_BOLD}8. Excluir Doce (DELETE /api/doces/:id)${ANSI_RESET}`);
    const resDelecao = await request(app).delete(`/api/doces/${doceCriadoId}`);
    assert(resDelecao.statusCode === 200, 'DELETE /api/doces/:id retorna status 200 OK');
    assert(resDelecao.body.mensagem.includes('sucesso'), 'Mensagem de sucesso na exclusão retornada');

    // Verifica que não existe mais no banco
    const resChecagem = await request(app).get(`/api/doces/${doceCriadoId}`);
    assert(resChecagem.statusCode === 404, 'Doce excluído retorna 404 Not Found em busca subsequente');

    const resDeleteNovamente = await request(app).delete(`/api/doces/${doceCriadoId}`);
    assert(resDeleteNovamente.statusCode === 404, 'Tentar excluir doce já removido retorna 404 Not Found');

    // ----------------------------------------------------
    // RESUMO FINAL
    // ----------------------------------------------------
    console.log(`\n${ANSI_BOLD}${ANSI_CYAN}====================================================${ANSI_RESET}`);
    console.log(`${ANSI_BOLD}📊 RESUMO DOS TESTES AUTOMATIZADOS${ANSI_RESET}`);
    console.log(`${ANSI_BOLD}${ANSI_CYAN}====================================================${ANSI_RESET}`);
    console.log(`  Total de asserções executadas: ${totalTestes}`);
    console.log(`  ${ANSI_GREEN}Aprovações:${ANSI_RESET} ${testesPassaram}`);
    console.log(`  ${ANSI_RED}Falhas:${ANSI_RESET} ${testesFalharam}`);

    if (testesFalharam > 0) {
      console.error(`\n❌ ${testesFalharam} teste(s) falharam.\n`);
      process.exit(1);
    } else {
      console.log(`\n🎉 ${ANSI_GREEN}${ANSI_BOLD}TODOS OS TESTES PASSARAM COM 100% DE SUCESSO!${ANSI_RESET}\n`);
    }
  } catch (erro) {
    console.error('Erro crítico durante a execução dos testes:', erro);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }
}

executarTestes();
