const express = require('express');
const router = express.Router();
const { cadastrarFornecedor, 
        listarFornecedores,
        atualizarFornecedor, 
        deletarFornecedor, 
        listarProdutosPorFornecedor
 } = require('../controllers/fornecedorController');

// Rota POST /api/fornecedores
router.post('/', cadastrarFornecedor);

// Rota GET /api/fornecedores
router.get('/', listarFornecedores);

// Rota PUT /api/fornecedores/:fornecedorId
router.put('/:fornecedorId', atualizarFornecedor); 

// Rota DELETE /api/fornecedores/:fornecedorId
router.delete('/:fornecedorId', deletarFornecedor);

// Rota para listar produtos de um fornecedor
router.get('/:fornecedorId/produtos', listarProdutosPorFornecedor);

module.exports = router;
