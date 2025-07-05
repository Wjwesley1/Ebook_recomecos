const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// Conexão com o banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Endpoint para obter dados do e-book
app.get('/api/livro', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM livros WHERE id = 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    const livro = {
      ...result.rows[0],
      preco: parseFloat(result.rows[0].preco),
    };
    res.json(livro);
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Endpoint para criar um pedido
app.post('/api/pedido', async (req, res) => {
  const { nome, email, endereco } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pedidos (cliente_nome, cliente_email, endereco, livro_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, email, endereco, 1, 'pendente']
    );
    res.json({
      mensagem: 'Pedido recebido com sucesso!',
      pedido: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Endpoint para listar pedidos (protegido por senha)
app.get('/api/pedidos', async (req, res) => {
  const { senha } = req.query;
  if (senha !== 'admin123') { // Senha estática para simplicidade
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }
  try {
    const result = await pool.query('SELECT * FROM pedidos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Endpoint para amostra do e-book (opcional)
app.get('/api/amostra', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'amostra_recomecos.pdf'));
});

app.listen(5000, () => console.log('Backend rodando na porta 5000'));