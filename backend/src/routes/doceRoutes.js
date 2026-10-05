const express = require('express');
const router = express.Router();
const doceController = require('../controllers/doceController');

// Rotas para /api/doces
router.get('/', doceController.listarDoces);
router.get('/:id', doceController.obterDocePorId);
router.post('/', doceController.criarDoce);
router.put('/:id', doceController.atualizarDoce);
router.delete('/:id', doceController.deletarDoce);

module.exports = router;
