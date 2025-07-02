import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AssociacaoPage({ onBack }) {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [associados, setAssociados] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    api.get('/produtos').then(res => setProdutos(res.data));
    api.get('/fornecedores').then(res => setFornecedores(res.data));
  }, []);

  useEffect(() => {
    if (produtoId) {
      const prod = produtos.find(p => String(p.id) === String(produtoId));
      setProdutoSelecionado(prod || null);
      listarAssociados(produtoId);
    } else {
      setProdutoSelecionado(null);
      setAssociados([]);
    }
  }, [produtoId, produtos]);

  function listarAssociados(id) {
    api.get(`/produtos/${id}/fornecedores`).then(res => setAssociados(res.data.fornecedores));
  }

  function associar(e) {
    e.preventDefault();
    api.post(`/produtos/${produtoId}/associar-fornecedor`, { fornecedorId: Number(fornecedorId) })
      .then(() => {
        listarAssociados(produtoId);
        setMensagem('Fornecedor associado com sucesso!');
        setTimeout(() => setMensagem(''), 2000);
      })
      .catch(() => {
        setMensagem('Erro ao associar fornecedor!');
        setTimeout(() => setMensagem(''), 2000);
      });
  }

  function desassociar(fid) {
    api.delete(`/produtos/${produtoId}/desassociar-fornecedor/${fid}`)
      .then(() => {
        listarAssociados(produtoId);
        setMensagem('Fornecedor desassociado!');
        setTimeout(() => setMensagem(''), 2000);
      })
      .catch(() => {
        setMensagem('Erro ao desassociar fornecedor!');
        setTimeout(() => setMensagem(''), 2000);
      });
  }

  return (
    <div className="container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2>Associação de Fornecedor a Produto</h2>
        {onBack && (
          <button onClick={onBack} style={{ marginLeft: 16 }}>Voltar</button>
        )}
      </div>
      {mensagem && <div className="card-matrix">{mensagem}</div>}

      <div className="card-matrix" style={{ marginBottom: 24 }}>
        <h3>Detalhes do Produto</h3>
        <select
          value={produtoId}
          onChange={e => setProdutoId(e.target.value)}
          style={{ marginBottom: 16 }}
        >
          <option value="">Selecione um produto</option>
          {produtos.map(p => (
            <option key={p.id} value={p.id}>{p.nomeProduto}</option>
          ))}
        </select>
        {produtoSelecionado && (
          <div style={{ marginTop: 12 }}>
            <div><strong>Nome:</strong> {produtoSelecionado.nomeProduto}</div>
            <div><strong>Código de Barras:</strong> {produtoSelecionado.codigoBarras}</div>
            <div><strong>Descrição:</strong> {produtoSelecionado.descricao}</div>
            {produtoSelecionado.imagem && (
              <div style={{ margin: "8px 0" }}>
                <img src={produtoSelecionado.imagem} alt="Produto" style={{ maxWidth: 80, border: "1px solid #00ff41", borderRadius: 8 }} />
              </div>
            )}
          </div>
        )}
      </div>

      {produtoSelecionado && (
        <>
          <form onSubmit={associar} style={{ marginBottom: 24 }}>
            <select
              value={fornecedorId}
              onChange={e => setFornecedorId(e.target.value)}
              required
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map(f => (
                <option key={f.id} value={f.id}>{f.nomeEmpresa}</option>
              ))}
            </select>
            <button type="submit" disabled={!fornecedorId}>Associar Fornecedor</button>
          </form>

          <div className="card-matrix">
            <h3>Fornecedores Associados</h3>
            <table className="table-matrix">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {associados.length === 0 && (
                  <tr>
                    <td colSpan={3}>Nenhum fornecedor associado.</td>
                  </tr>
                )}
                {associados.map(f => (
                  <tr key={f.id}>
                    <td>{f.nomeEmpresa}</td>
                    <td>{f.cnpj}</td>
                    <td>
                      <button onClick={() => desassociar(f.id)}>Desassociar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}