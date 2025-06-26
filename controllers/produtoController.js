const { produtos } = require('../database/db');
const Produto = require('../models/produtoModel');

function cadastrarProduto(req, res) {
  const { nomeProduto, codigoBarras, descricao, quantidadeEstoque, categoria, dataValidade, imagemProduto } = req.body;

  // Validação básica
  if (!nomeProduto || !codigoBarras || !descricao || !quantidadeEstoque || !categoria) {
    return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser preenchidos!" });
  }

  // Valida duplicidade do código de barras
  const jaExiste = produtos.find(p => p.codigoBarras === codigoBarras);
  if (jaExiste) {
    return res.status(400).json({ mensagem: "Produto com este código de barras já está cadastrado!" });
  }

  // Criação e persistência
  const novoProduto = new Produto(nomeProduto, codigoBarras, descricao, quantidadeEstoque, categoria, dataValidade, imagemProduto);
  produtos.push(novoProduto);

  return res.status(201).json({ mensagem: "Produto cadastrado com sucesso!", produto: novoProduto });
}

const { fornecedores } = require('../database/db');



// Associar fornecedor a produto

function associarFornecedor(req, res) {
  const { produtoId } = req.params;
  const { fornecedorId } = req.body;

  // Encontrar o produto

  const produto = produtos.find(p => p.id == Number(produtoId));
  if (!produto) {
    return res.status(404).json({ mensagem: "Produto não encontrado!" });
  }

  // Encontrar o fornecedor

  const fornecedor = fornecedores.find(f => f.id == Number(fornecedorId));
  if (!fornecedor) {
    return res.status(404).json({ mensagem: "Fornecedor não encontrado!" });
  }

  // Verifica se já está associado

  const jaAssociado = produto.fornecedoresAssociados.includes(Number(fornecedorId));
  if (jaAssociado) {
    return res.status(400).json({ mensagem: "Fornecedor já está associado a este produto!" });
  }

  produto.fornecedoresAssociados.push(Number(fornecedorId));
  return res.status(200).json({ mensagem: "Fornecedor associado com sucesso ao produto!", produto });
}



// Desassociar fornecedor de produto

function desassociarFornecedor(req, res) {
  const { produtoId, fornecedorId } = req.params;

  const produto = produtos.find(p => p.id == produtoId);
  if (!produto) {
    return res.status(404).json({ mensagem: "Produto não encontrado!" });
  }

  const index = produto.fornecedoresAssociados.indexOf(Number(fornecedorId));
  if (index === -1) {
    return res.status(400).json({ mensagem: "Fornecedor não está associado a este produto!" });
  }

  produto.fornecedoresAssociados.splice(index, 1);
  return res.status(200).json({ mensagem: "Fornecedor desassociado com sucesso!", produto });
}



// Listar fornecedores associados

function listarFornecedoresAssociados(req, res) {
  const { produtoId } = req.params;

  const produto = produtos.find(p => p.id == produtoId);
  if (!produto) {
    return res.status(404).json({ mensagem: "Produto não encontrado!" });
  }

  const listaFornecedores = produto.fornecedoresAssociados
    .map(id => fornecedores.find(f => f.id == id))
    .filter(f => f); // Remove nulos (caso algum fornecedor tenha sido deletado)

  return res.status(200).json({ fornecedores: listaFornecedores });
}

function listarProdutos(req, res) {
  return res.status(200).json(produtos); // retorna o array completo
}


// Atualizar produto
// Permite atualizar apenas os campos enviados no corpo da requisição
function atualizarProduto(req, res) {
  const { produtoId } = req.params;
  const { nomeProduto, codigoBarras, descricao, quantidadeEstoque, categoria, dataValidade, imagemProduto } = req.body;

  const produto = produtos.find(p => p.id == Number(produtoId));
  if (!produto) {
    return res.status(404).json({ mensagem: "Produto não encontrado!" });
  }

  // Atualiza apenas os campos enviados
  if (nomeProduto !== undefined) produto.nomeProduto = nomeProduto;
  if (codigoBarras !== undefined) produto.codigoBarras = codigoBarras;
  if (descricao !== undefined) produto.descricao = descricao;
  if (quantidadeEstoque !== undefined) produto.quantidadeEstoque = quantidadeEstoque;
  if (categoria !== undefined) produto.categoria = categoria;
  if (dataValidade !== undefined) produto.dataValidade = dataValidade;
  if (imagemProduto !== undefined) produto.imagemProduto = imagemProduto;

  return res.status(200).json({ mensagem: "Produto atualizado com sucesso!", produto });
}



// Deletar produto

function deletarProduto(req, res) {
  const { produtoId } = req.params;
  const index = produtos.findIndex(p => p.id == Number(produtoId));
  if (index === -1) {
    return res.status(404).json({ mensagem: "Produto não encontrado!" });
  }
  produtos.splice(index, 1);
  return res.status(200).json({ mensagem: "Produto deletado com sucesso!" });
}


// Exportando as funções do controller
// Isso permite que outras partes da aplicação importem e utilizem essas funções
module.exports = {
  cadastrarProduto,
  listarProdutos,
  associarFornecedor,
  desassociarFornecedor,
  listarFornecedoresAssociados,
  atualizarProduto,
  deletarProduto  
};

