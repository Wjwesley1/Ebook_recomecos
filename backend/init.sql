CREATE TABLE IF NOT EXISTS livros (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  descricao TEXT,
  imagem VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_email VARCHAR(255) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  livro_id INTEGER REFERENCES livros(id),
  status VARCHAR(50) DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais
INSERT INTO livros (id, titulo, preco, descricao, imagem)
VALUES (1, 'Ebook Recomeços', 49.90, 'Um guia inspirador para novos começos!', '/images/ebook_recomecos.jpg')
ON CONFLICT (id) DO NOTHING;