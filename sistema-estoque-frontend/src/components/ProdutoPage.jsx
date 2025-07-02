import React, { useEffect, useState } from "react";
import api from "../services/api";

const categoriasPadrao = [
  "Eletrônicos",
  "Alimentos",
  "Vestuário",
  "Limpeza",
  "Papelaria",
  "Outro"
];

export default function ProdutoPage() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    nomeProduto: '',
    codigoBarras: '',
    descricao: '',
    quantidadeEstoque: '',
    categoria: '',
    categoriaOutro: '',
    dataValidade: '',
    imagem: null
  });
  const [editId, setEditId] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [imagemPreview, setImagemPreview] = useState(null);

  useEffect(() => {
    api.get('/produtos').then(res => setProdutos(res.data));
  }, []);

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, imagem: files[0] });
      setImagemPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    let categoriaFinal = form.categoria === "Outro" ? form.categoriaOutro : form.categoria;
    // Monta o objeto para envio (sem imagem real, pois não há backend para upload)
    const produtoData = {
      ...form,
      categoria: categoriaFinal,
      imagem: imagemPreview, // Apenas preview local
    };
    if (editId) {
      api.put(`/produtos/${editId}`, produtoData).then(res => {
        setProdutos(produtos.map(p => p.id === editId ? res.data.produto : p));
        resetForm();
        setMensagem('Produto atualizado com sucesso!');
        setTimeout(() => setMensagem(''), 2000);
      }).catch(() => {
        setMensagem('Erro ao atualizar produto!');
        setTimeout(() => setMensagem(''), 2000);
      });
    } else {
      api.post('/produtos', produtoData).then(res => {
        setProdutos([...produtos, res.data.produto]);
        resetForm();
        setMensagem('Produto cadastrado com sucesso!');
        setTimeout(() => setMensagem(''), 2000);
      }).catch(() => {
        setMensagem('Erro ao cadastrar produto!');
        setTimeout(() => setMensagem(''), 2000);
      });
    }
  }

  function handleEdit(produto) {
    setForm({
      ...produto,
      categoriaOutro: produto.categoria && !categoriasPadrao.includes(produto.categoria) ? produto.categoria : '',
      categoria: categoriasPadrao.includes(produto.categoria) ? produto.categoria : 'Outro',
      imagem: null // Não há imagem real no backend
    });
    setImagemPreview(produto.imagem || null);
    setEditId(produto.id);
  }

  function handleDelete(id) {
    api.delete(`/produtos/${id}`).then(() => {
      setProdutos(produtos.filter(p => p.id !== id));
      setMensagem('Produto excluído com sucesso!');
      setTimeout(() => setMensagem(''), 2000);
    }).catch(() => {
      setMensagem('Erro ao excluir produto!');
      setTimeout(() => setMensagem(''), 2000);
    });
  }

  function resetForm() {
    setForm({
      nomeProduto: '',
      codigoBarras: '',
      descricao: '',
      quantidadeEstoque: '',
      categoria: '',
      categoriaOutro: '',
      dataValidade: '',
      imagem: null
    });
    setEditId(null);
    setImagemPreview(null);
  }

  return (
    <div className="container">
      <h2>Cadastro de Produto</h2>
      {mensagem && <div className="card-matrix">{mensagem}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="nomeProduto"
          placeholder="Insira o nome do produto"
          value={form.nomeProduto}
          onChange={handleChange}
          required
        />
        <input
          name="codigoBarras"
          placeholder="Insira o código de Barras"
          value={form.codigoBarras}
          onChange={handleChange}
          required
        />
        <input
          name="descricao"
          placeholder="Descreva brevemente o produto"
          value={form.descricao}
          onChange={handleChange}
          required
        />
        <input
          name="quantidadeEstoque"
          placeholder="Quantidade disponível"
          type="number"
          min="0"
          value={form.quantidadeEstoque}
          onChange={handleChange}
          required
        />
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          required
        >
          <option value="">Selecione a categoria</option>
          {categoriasPadrao.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {form.categoria === "Outro" && (
          <input
            name="categoriaOutro"
            placeholder="Informe a categoria"
            value={form.categoriaOutro}
            onChange={handleChange}
            required
          />
        )}

        <input
          id="dataValidade"
          name="dataValidade"
          type="date"
          value={form.dataValidade}
          onChange={handleChange}
        />
          
        <input
          name="imagem"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
        {imagemPreview && (
          <div style={{ margin: "8px 0" }}>
            <img src={imagemPreview} alt="Preview" style={{ maxWidth: 120, border: "1px solid #00ff41", borderRadius: 8 }} />
          </div>
        )}
        <button type="submit">{editId ? 'Atualizar' : 'Cadastrar'}</button>
        {editId && (
          <button type="button" onClick={resetForm}>Cancelar</button>
        )}
      </form>
      <table className="table-matrix">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Código de Barras</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Categoria</th>
            <th>Validade</th>
            <th>Imagem</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(p => (
            <tr key={p.id}>
              <td>{p.nomeProduto}</td>
              <td>{p.codigoBarras}</td>
              <td>{p.descricao}</td>
              <td>{p.quantidadeEstoque}</td>
              <td>{p.categoria}</td>
              <td>{p.dataValidade || '-'}</td>
              <td>
                {p.imagem && (
                  <img src={p.imagem} alt="Produto" style={{ maxWidth: 60, border: "1px solid #00ff41", borderRadius: 4 }} />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}