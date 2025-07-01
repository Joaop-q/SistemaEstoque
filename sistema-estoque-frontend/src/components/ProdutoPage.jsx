import React, {useEffect, useState} from "react";
import api from "../services/api";


export default function ProdutoPage() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    nomeProduto: '', codigoBarras: '', descricao: '', quantidadeEstoque: '', categoria: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    api.get('/produtos').then(res => setProdutos(res.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      api.put(`/produtos/${editId}`, form).then(res => {
        setProdutos(produtos.map(p => p.id === editId ? res.data.produto : p));
        setForm({ nomeProduto: '', codigoBarras: '', descricao: '', quantidadeEstoque: '', categoria: '' });
        setEditId(null);
      });
    } else {
      api.post('/produtos', form).then(res => {
        setProdutos([...produtos, res.data.produto]);
        setForm({ nomeProduto: '', codigoBarras: '', descricao: '', quantidadeEstoque: '', categoria: '' });
      });
    }
  }

  function handleEdit(produto) {
    setForm(produto);
    setEditId(produto.id);
  }

  function handleDelete(id) {
    api.delete(`/produtos/${id}`).then(() => {
      setProdutos(produtos.filter(p => p.id !== id));
    });
  }

  return (
    <div>
      <h2>Produtos</h2>
      <form onSubmit={handleSubmit}>
        <input name="nomeProduto" placeholder="Nome" value={form.nomeProduto} onChange={handleChange} required />
        <input name="codigoBarras" placeholder="Código de Barras" value={form.codigoBarras} onChange={handleChange} required />
        <input name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} required />
        <input name="quantidadeEstoque" placeholder="Quantidade" type="number" value={form.quantidadeEstoque} onChange={handleChange} required />
        <input name="categoria" placeholder="Categoria" value={form.categoria} onChange={handleChange} required />
        <button type="submit">{editId ? 'Atualizar' : 'Cadastrar'}</button>
        {editId && <button type="button" onClick={() => { setForm({ nomeProduto: '', codigoBarras: '', descricao: '', quantidadeEstoque: '', categoria: '' }); setEditId(null); }}>Cancelar</button>}
      </form>
      <ul>
        {produtos.map(p => (
          <li key={p.id}>
            {p.nomeProduto} - {p.codigoBarras}
            <button onClick={() => handleEdit(p)}>Editar</button>
            <button onClick={() => handleDelete(p.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}