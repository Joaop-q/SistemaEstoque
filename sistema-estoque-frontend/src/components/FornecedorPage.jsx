import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function FornecedorPage() {
  const [fornecedores, setFornecedores] = useState([]);
  const [form, setForm] = useState({
    nomeEmpresa: '', cnpj: '', endereco: '', telefone: '', email: '', contatoPrincipal: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    api.get('/fornecedores').then(res => setFornecedores(res.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      api.put(`/fornecedores/${editId}`, form).then(res => {
        setFornecedores(fornecedores.map(f => f.id === editId ? res.data.fornecedor : f));
        setForm({ nomeEmpresa: '', cnpj: '', endereco: '', telefone: '', email: '', contatoPrincipal: '' });
        setEditId(null);
      });
    } else {
      api.post('/fornecedores', form).then(res => {
        setFornecedores([...fornecedores, res.data.fornecedor]);
        setForm({ nomeEmpresa: '', cnpj: '', endereco: '', telefone: '', email: '', contatoPrincipal: '' });
      });
    }
  }

  function handleEdit(fornecedor) {
    setForm(fornecedor);
    setEditId(fornecedor.id);
  }

  function handleDelete(id) {
    api.delete(`/fornecedores/${id}`).then(() => {
      setFornecedores(fornecedores.filter(f => f.id !== id));
    });
  }

  return (
    <div>
      <h2>Fornecedores</h2>
      <form onSubmit={handleSubmit}>
        <input name="nomeEmpresa" placeholder="Nome" value={form.nomeEmpresa} onChange={handleChange} required />
        <input name="cnpj" placeholder="CNPJ" value={form.cnpj} onChange={handleChange} required />
        <input name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} required />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="contatoPrincipal" placeholder="Contato Principal" value={form.contatoPrincipal} onChange={handleChange} required />
        <button type="submit">{editId ? 'Atualizar' : 'Cadastrar'}</button>
        {editId && <button type="button" onClick={() => { setForm({ nomeEmpresa: '', cnpj: '', endereco: '', telefone: '', email: '', contatoPrincipal: '' }); setEditId(null); }}>Cancelar</button>}
      </form>
      <ul>
        {fornecedores.map(f => (
          <li key={f.id}>
            {f.nomeEmpresa} - {f.cnpj}
            <button onClick={() => handleEdit(f)}>Editar</button>
            <button onClick={() => handleDelete(f.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}