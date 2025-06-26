const express = require('express');
const router = express.Router();
const {
  cadastrarProduto,
  associarFornecedor,
  desassociarFornecedor,
  listarFornecedoresAssociados,
  listarProdutos,
  atualizarProduto, 
  deletarProduto
} = require('../controllers/produtoController');

// Rota POST para cadastrar produto
router.post('/', cadastrarProduto);

// Rota para associar fornecedor a um produto
router.post('/:produtoId/associar-fornecedor', associarFornecedor);

// Rota para desassociar fornecedor
router.delete('/:produtoId/desassociar-fornecedor/:fornecedorId', desassociarFornecedor);

// Rota para listar fornecedores associados a um produto
router.get('/:produtoId/fornecedores', listarFornecedoresAssociados);

// Rota para listar todos os produtos
router.get('/', listarProdutos);


// Rota para atualizar um produto
router.put('/:produtoId', atualizarProduto);

// Rota para deletar um produto
router.delete('/:produtoId', deletarProduto);

module.exports = router;

