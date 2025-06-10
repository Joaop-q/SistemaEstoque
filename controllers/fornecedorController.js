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

module.exports = {
  cadastrarFornecedor
};
