import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function FornecedorPage() {
  const [fornecedores, setFornecedores] = useState([]);
  const [form, setForm] = useState({
    nomeEmpresa: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    contatoPrincipal: ''
  });
  const [editId, setEditId] = useState(null);
  const [mensagem, setMensagem] = useState('');

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
        resetForm();
        setMensagem('Fornecedor atualizado com sucesso!');
        setTimeout(() => setMensagem(''), 2000);
      }).catch(() => {
        setMensagem('Erro ao atualizar fornecedor!');
        setTimeout(() => setMensagem(''), 2000);
      });
    } else {
      api.post('/fornecedores', form).then(res => {
        setFornecedores([...fornecedores, res.data.fornecedor]);
        resetForm();
        setMensagem('Fornecedor cadastrado com sucesso!');
        setTimeout(() => setMensagem(''), 2000);
      }).catch(() => {
        setMensagem('Erro ao cadastrar fornecedor!');
        setTimeout(() => setMensagem(''), 2000);
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
      setMensagem('Fornecedor excluído com sucesso!');
      setTimeout(() => setMensagem(''), 2000);
    }).catch(() => {
      setMensagem('Erro ao excluir fornecedor!');
      setTimeout(() => setMensagem(''), 2000);
    });
  }

  function resetForm() {
    setForm({
      nomeEmpresa: '',
      cnpj: '',
      endereco: '',
      telefone: '',
      email: '',
      contatoPrincipal: ''
    });
    setEditId(null);
  }

  return (
    <div className="container">
      <h2>Cadastro de Fornecedor</h2>
      {mensagem && <div className="card-matrix">{mensagem}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="nomeEmpresa"
          placeholder="Nome da empresa"
          value={form.nomeEmpresa}
          onChange={handleChange}
          required
        />
        <input
          name="cnpj"
          placeholder="00.000.000/0000-00"
          value={form.cnpj}
          onChange={handleChange}
          required
        />
        <input
          name="endereco"
          placeholder="Endereço"
          value={form.endereco}
          onChange={handleChange}
          required
        />
        <input
          name="telefone"
          placeholder="(00) 00000-0000"
          value={form.telefone}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="exemplo@fornecedor.com"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="contatoPrincipal"
          placeholder="Nome do contato principal"
          value={form.contatoPrincipal}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? 'Atualizar' : 'Cadastrar'}</button>
        {editId && (
          <button type="button" onClick={resetForm}>Cancelar</button>
        )}
      </form>
      <table className="table-matrix">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Contato Principal</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map(f => (
            <tr key={f.id}>
              <td>{f.nomeEmpresa}</td>
              <td>{f.cnpj}</td>
              <td>{f.endereco}</td>
              <td>{f.telefone}</td>
              <td>{f.email}</td>
              <td>{f.contatoPrincipal}</td>
              <td>
                <button onClick={() => handleEdit(f)}>Editar</button>
                <button onClick={() => handleDelete(f.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}