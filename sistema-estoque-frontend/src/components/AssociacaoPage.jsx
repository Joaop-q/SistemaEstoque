import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AssociacaoPage() {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [associados, setAssociados] = useState([]);
  const [produtosDoFornecedor, setProdutosDoFornecedor] = useState([]);

  useEffect(() => {
    api.get('/produtos').then(res => setProdutos(res.data));
    api.get('/fornecedores').then(res => setFornecedores(res.data));
  }, []);

  function listarAssociados(id) {
    api.get(`/produtos/${id}/fornecedores`).then(res => setAssociados(res.data.fornecedores));
  }

  function listarProdutosFornecedor(id) {
    api.get(`/fornecedores/${id}/produtos`).then(res => setProdutosDoFornecedor(res.data.produtos));
  }

  function associar(e) {
    e.preventDefault();
    api.post(`/produtos/${produtoId}/associar-fornecedor`, { fornecedorId: Number(fornecedorId) })
      .then(() => listarAssociados(produtoId));
  }

  function desassociar(fid) {
    api.delete(`/produtos/${produtoId}/desassociar-fornecedor/${fid}`)
      .then(() => listarAssociados(produtoId));
  }

  return (
    <div>
      <h2>Associação Produto/Fornecedor</h2>
      <form onSubmit={associar}>
        <select value={produtoId} onChange={e => { setProdutoId(e.target.value); listarAssociados(e.target.value); }}>
          <option value="">Selecione um produto</option>
          {produtos.map(p => <option key={p.id} value={p.id}>{p.nomeProduto}</option>)}
        </select>
        <select value={fornecedorId} onChange={e => { setFornecedorId(e.target.value); listarProdutosFornecedor(e.target.value); }}>
          <option value="">Selecione um fornecedor</option>
          {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nomeEmpresa}</option>)}
        </select>
        <button type="submit" disabled={!produtoId || !fornecedorId}>Associar</button>
      </form>
      <h3>Fornecedores Associados ao Produto</h3>
      <ul>
        {associados.map(f => (
          <li key={f.id}>
            {f.nomeEmpresa} <button onClick={() => desassociar(f.id)}>Desassociar</button>
          </li>
        ))}
      </ul>
      <h3>Produtos do Fornecedor Selecionado</h3>
      <ul>
        {produtosDoFornecedor.map(p => (
          <li key={p.id}>{p.nomeProduto}</li>
        ))}
      </ul>
    </div>
  );
}