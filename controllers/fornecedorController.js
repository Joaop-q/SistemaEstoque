const { fornecedores } = require('../database/db');
const Fornecedor = require('../models/fornecedorModel');

function cadastrarFornecedor(req, res) {
  const { nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;

  // Validação básica
  if (!nomeEmpresa || !cnpj || !endereco || !telefone || !email || !contatoPrincipal) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  // Verifica se CNPJ já existe
  const existe = fornecedores.find(f => f.cnpj === cnpj);
  if (existe) {
    return res.status(400).json({ mensagem: "Fornecedor com esse CNPJ já está cadastrado!" });
  }

  const novoFornecedor = new Fornecedor(nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal);
  fornecedores.push(novoFornecedor);

  return res.status(201).json({ mensagem: "Fornecedor cadastrado com sucesso!", fornecedor: novoFornecedor });
}

function listarFornecedores(req, res) {
  return res.status(200).json(fornecedores); // retorna todos os fornecedores
}


// Atualizar fornecedor
// Verifica se o fornecedor existe e atualiza os campos fornecidos
// Retorna o fornecedor atualizado ou uma mensagem de erro
function atualizarFornecedor(req, res) {
  const { fornecedorId } = req.params;
  const { nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;

  const fornecedor = fornecedores.find(f => f.id == Number(fornecedorId));
  if (!fornecedor) {
    return res.status(404).json({ mensagem: "Fornecedor não encontrado!" });
  }

  if (nomeEmpresa !== undefined) fornecedor.nomeEmpresa = nomeEmpresa;
  if (cnpj !== undefined) fornecedor.cnpj = cnpj;
  if (endereco !== undefined) fornecedor.endereco = endereco;
  if (telefone !== undefined) fornecedor.telefone = telefone;
  if (email !== undefined) fornecedor.email = email;
  if (contatoPrincipal !== undefined) fornecedor.contatoPrincipal = contatoPrincipal;

  return res.status(200).json({ mensagem: "Fornecedor atualizado com sucesso!", fornecedor });
}



// Deletar fornecedor
// Verifica se o fornecedor existe e o remove da lista
// Retorna uma mensagem de sucesso ou erro
function deletarFornecedor(req, res) {
  const { fornecedorId } = req.params;
  const index = fornecedores.findIndex(f => f.id == Number(fornecedorId));
  if (index === -1) {
    return res.status(404).json({ mensagem: "Fornecedor não encontrado!" });
  }
  fornecedores.splice(index, 1);
  return res.status(200).json({ mensagem: "Fornecedor deletado com sucesso!" });
}

module.exports = {
  cadastrarFornecedor,
  listarFornecedores,
  atualizarFornecedor,
  deletarFornecedor
};
