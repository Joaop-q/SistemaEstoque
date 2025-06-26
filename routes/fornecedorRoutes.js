const express = require('express');
const router = express.Router();
const { cadastrarFornecedor, listarFornecedores } = require('../controllers/fornecedorController');

// Rota POST /api/fornecedores
router.post('/', cadastrarFornecedor);

// Rota GET /api/fornecedores
router.get('/', listarFornecedores);

module.exports = router;
