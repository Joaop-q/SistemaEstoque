class Produto {
  constructor(
    nomeProduto,
    codigoBarras,
    descricao,
    quantidadeEstoque,
    categoria,
    dataValidade,
    imagemProduto
  ) {
    this.id = Date.now();
    this.nomeProduto = nomeProduto;
    this.codigoBarras = codigoBarras;
    this.descricao = descricao;
    this.quantidadeEstoque = quantidadeEstoque;
    this.categoria = categoria;
    this.dataValidade = dataValidade || null;
    this.imagemProduto = imagemProduto || null;
    this.fornecedoresAssociados = []; // <- NOVO campo
  }
}

module.exports = Produto;

