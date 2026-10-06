const mongoose = require('mongoose');
const Doce = require('../models/Doce');
const connectDB = require('../config/db');
const { docesIniciais } = require('../config/seed');

// Armazenamento em memória para demonstração (ativo caso MongoDB Atlas ainda não esteja configurado)
let memoryDoces = docesIniciais.map((d, index) => ({
  _id: '67a00000000000000000000' + (index + 1),
  nome: d.nome,
  tipo: d.tipo,
  preco: d.preco,
  fotoUrl: d.fotoUrl,
  createdAt: new Date(Date.now() - (index * 60000)),
  updatedAt: new Date(Date.now() - (index * 60000))
}));

// Helper para verificar disponibilidade de conexão real com o MongoDB
async function getMongoConnection() {
  try {
    const conn = await connectDB();
    if (conn && mongoose.connection.readyState === 1) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Listar todos os doces
exports.listarDoces = async (req, res) => {
  try {
    const isMongoConnected = await getMongoConnection();
    if (isMongoConnected) {
      const doces = await Doce.find().sort({ createdAt: -1 });
      return res.status(200).json(doces);
    }

    // Fallback em memória para funcionamento imediato
    const docesOrdenados = [...memoryDoces].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return res.status(200).json(docesOrdenados);
  } catch (error) {
    console.error('Erro ao listar doces:', error);
    return res.status(500).json({
      erro: 'Erro interno ao buscar a lista de doces.',
      detalhes: error.message
    });
  }
};

// Obter doce por ID
exports.obterDocePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const isMongoConnected = await getMongoConnection();
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ erro: 'ID de doce inválido.' });
      }

      const doce = await Doce.findById(id);
      if (!doce) {
        return res.status(404).json({ erro: 'Doce não encontrado para o ID informado.' });
      }

      return res.status(200).json(doce);
    }

    const doce = memoryDoces.find(d => String(d._id) === String(id));
    if (!doce) {
      return res.status(404).json({ erro: 'Doce não encontrado para o ID informado.' });
    }

    return res.status(200).json(doce);
  } catch (error) {
    console.error('Erro ao buscar doce por ID:', error);
    return res.status(500).json({
      erro: 'Erro interno ao buscar doce.',
      detalhes: error.message
    });
  }
};

// Cadastrar um novo doce
exports.criarDoce = async (req, res) => {
  try {
    const { nome, tipo, preco, fotoUrl } = req.body;

    if (!nome || !tipo || preco === undefined || preco === null || !fotoUrl) {
      return res.status(400).json({
        erro: 'Campos obrigatórios ausentes: nome, tipo, preco e fotoUrl devem ser informados.'
      });
    }

    const precoNumerico = Number(preco);
    if (isNaN(precoNumerico) || precoNumerico < 0) {
      return res.status(400).json({
        erro: 'O preço informado deve ser um número positivo.'
      });
    }

    const isMongoConnected = await getMongoConnection();
    if (isMongoConnected) {
      const novoDoce = await Doce.create({
        nome: nome.trim(),
        tipo: tipo.trim(),
        preco: precoNumerico,
        fotoUrl: fotoUrl.trim()
      });

      return res.status(201).json({
        mensagem: 'Doce cadastrado com sucesso!',
        doce: novoDoce
      });
    }

    // Fallback em memória
    const novoDoce = {
      _id: new mongoose.Types.ObjectId().toString(),
      nome: nome.trim(),
      tipo: tipo.trim(),
      preco: precoNumerico,
      fotoUrl: fotoUrl.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryDoces.unshift(novoDoce);

    return res.status(201).json({
      mensagem: 'Doce cadastrado com sucesso!',
      doce: novoDoce
    });
  } catch (error) {
    console.error('Erro ao cadastrar doce:', error);
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ erro: mensagens.join(' ') });
    }

    return res.status(500).json({
      erro: 'Erro interno ao cadastrar doce.',
      detalhes: error.message
    });
  }
};

// Atualizar doce existente
exports.atualizarDoce = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, tipo, preco, fotoUrl } = req.body;

    let precoNumerico;
    if (preco !== undefined) {
      precoNumerico = Number(preco);
      if (isNaN(precoNumerico) || precoNumerico < 0) {
        return res.status(400).json({ erro: 'O preço deve ser um número positivo.' });
      }
    }

    const isMongoConnected = await getMongoConnection();
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ erro: 'ID de doce inválido.' });
      }

      const camposAtualizacao = {};
      if (nome !== undefined) camposAtualizacao.nome = nome.trim();
      if (tipo !== undefined) camposAtualizacao.tipo = tipo.trim();
      if (precoNumerico !== undefined) camposAtualizacao.preco = precoNumerico;
      if (fotoUrl !== undefined) camposAtualizacao.fotoUrl = fotoUrl.trim();

      const doceAtualizado = await Doce.findByIdAndUpdate(
        id,
        camposAtualizacao,
        { new: true, runValidators: true }
      );

      if (!doceAtualizado) {
        return res.status(404).json({ erro: 'Doce não encontrado para o ID informado.' });
      }

      return res.status(200).json({
        mensagem: 'Doce atualizado com sucesso!',
        doce: doceAtualizado
      });
    }

    // Fallback em memória
    const index = memoryDoces.findIndex(d => String(d._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ erro: 'Doce não encontrado para o ID informado.' });
    }

    if (nome !== undefined) memoryDoces[index].nome = nome.trim();
    if (tipo !== undefined) memoryDoces[index].tipo = tipo.trim();
    if (precoNumerico !== undefined) memoryDoces[index].preco = precoNumerico;
    if (fotoUrl !== undefined) memoryDoces[index].fotoUrl = fotoUrl.trim();
    memoryDoces[index].updatedAt = new Date();

    return res.status(200).json({
      mensagem: 'Doce atualizado com sucesso!',
      doce: memoryDoces[index]
    });
  } catch (error) {
    console.error('Erro ao atualizar doce:', error);
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ erro: mensagens.join(' ') });
    }

    return res.status(500).json({
      erro: 'Erro interno ao atualizar doce.',
      detalhes: error.message
    });
  }
};

// Remover um doce
exports.deletarDoce = async (req, res) => {
  try {
    const { id } = req.params;

    const isMongoConnected = await getMongoConnection();
    if (isMongoConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ erro: 'ID de doce inválido.' });
      }

      const doceRemovido = await Doce.findByIdAndDelete(id);
      if (!doceRemovido) {
        return res.status(404).json({ erro: 'Doce não encontrado para o ID informado.' });
      }

      return res.status(200).json({
        mensagem: 'Doce removido com sucesso!',
        id: doceRemovido._id
      });
    }

    // Fallback em memória
    const index = memoryDoces.findIndex(d => String(d._id) === String(id));
    if (index === -1) {
      return res.status(404).json({ erro: 'Doce não encontrado para o ID informado.' });
    }

    const [removido] = memoryDoces.splice(index, 1);

    return res.status(200).json({
      mensagem: 'Doce removido com sucesso!',
      id: removido._id
    });
  } catch (error) {
    console.error('Erro ao excluir doce:', error);
    return res.status(500).json({
      erro: 'Erro interno ao remover doce.',
      detalhes: error.message
    });
  }
};
