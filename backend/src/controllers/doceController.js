const mongoose = require('mongoose');
const Doce = require('../models/Doce');
const connectDB = require('../config/db');

// Listar todos os doces
exports.listarDoces = async (req, res) => {
  try {
    await connectDB();
    const doces = await Doce.find().sort({ createdAt: -1 });
    return res.status(200).json(doces);
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ erro: 'ID de doce inválido.' });
    }

    await connectDB();
    const doce = await Doce.findById(id);

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

    await connectDB();

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ erro: 'ID de doce inválido.' });
    }

    const { nome, tipo, preco, fotoUrl } = req.body;

    const camposAtualizacao = {};
    if (nome !== undefined) camposAtualizacao.nome = nome.trim();
    if (tipo !== undefined) camposAtualizacao.tipo = tipo.trim();
    if (preco !== undefined) {
      const precoNumerico = Number(preco);
      if (isNaN(precoNumerico) || precoNumerico < 0) {
        return res.status(400).json({ erro: 'O preço deve ser um número positivo.' });
      }
      camposAtualizacao.preco = precoNumerico;
    }
    if (fotoUrl !== undefined) camposAtualizacao.fotoUrl = fotoUrl.trim();

    await connectDB();

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ erro: 'ID de doce inválido.' });
    }

    await connectDB();
    const doceRemovido = await Doce.findByIdAndDelete(id);

    if (!doceRemovido) {
      return res.status(404).json({ erro: 'Doce não encontrado para o ID informado.' });
    }

    return res.status(200).json({
      mensagem: 'Doce removido com sucesso!',
      id: doceRemovido._id
    });
  } catch (error) {
    console.error('Erro ao excluir doce:', error);
    return res.status(500).json({
      erro: 'Erro interno ao remover doce.',
      detalhes: error.message
    });
  }
};
