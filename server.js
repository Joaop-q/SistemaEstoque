const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fornecedorRoutes = require('./routes/fornecedorRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/fornecedores', fornecedorRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
