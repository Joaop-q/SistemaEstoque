const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const produtoRoutes = require('./routes/produtoRoutes');


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/produtos', produtoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});