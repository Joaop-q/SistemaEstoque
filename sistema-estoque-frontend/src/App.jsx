import React, { useState } from 'react';
import ProdutoPage from './components/ProdutoPage';
import FornecedorPage from './components/FornecedorPage';
import AssociacaoPage from './components/AssociacaoPage';
import './style.css';

export default function App() {
  const [page, setPage] = useState('produtos');
  return (
    <div>
      <nav>
        <button onClick={() => setPage('produtos')}>Produtos</button>
        <button onClick={() => setPage('fornecedores')}>Fornecedores</button>
        <button onClick={() => setPage('associacao')}>Associação</button>
      </nav>
      {page === 'produtos' && <ProdutoPage />}
      {page === 'fornecedores' && <FornecedorPage />}
      {page === 'associacao' && <AssociacaoPage />}
    </div>
  );
}