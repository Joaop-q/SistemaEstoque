class Fornecedor {
  constructor(nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal) {
    this.id = Date.now(); // gera ID simples com timestamp
    this.nomeEmpresa = nomeEmpresa;
    this.cnpj = cnpj;
    this.endereco = endereco;
    this.telefone = telefone;
    this.email = email;
    this.contatoPrincipal = contatoPrincipal;
  }
}

module.exports = Fornecedor;
