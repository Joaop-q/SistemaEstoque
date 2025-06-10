const express = require('express');
const router = express.Router();
const { cadastrarFornecedor } = require('../controllers/fornecedorController');

// Rota POST /api/fornecedores
router.post('/', cadastrarFornecedor);

module.exports = router;
