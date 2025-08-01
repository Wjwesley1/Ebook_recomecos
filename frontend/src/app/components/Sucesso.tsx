import React from 'react';
import { Link } from 'react-router-dom';
import './Sucesso.css'; // Estilo que vamos criar

function Sucesso() {
  return (
    <div className="sucesso-container">
      <h1>Pagamento Confirmado! 🎉</h1>
      <p>Obrigado por adquirir o <strong>E-book Recomeços</strong>!</p>
      <p>O arquivo será enviado para o seu e-mail em breve. Verifique a caixa de entrada e a pasta de spam.</p>
      <Link to="/" className="sucesso-button">
        Voltar para a Página Inicial
      </Link>
    </div>
  );
}

export default Sucesso;