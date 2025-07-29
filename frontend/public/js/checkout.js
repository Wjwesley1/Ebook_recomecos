// public/js/checkout.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando formulário');
  const form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Lógica do formulário
      const data = {
        nome: form.querySelector('#nome').value,
        email: form.querySelector('#email').value,
        cpf: form.querySelector('#cpf').value,
        endereco: form.querySelector('#endereco').value,
        livroId: 1,
        amount: 19.90,
        paymentMethod: form.querySelector('#paymentMethod').value
      };
      try {
        const response = await fetch('https://ebook-recomecos-backend.onrender.com/api/pedido', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://ebook-recomecos.onrender.com'
          },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        window.location.href = result.payment_url;
      } catch (error) {
        console.error('Erro:', error);
      }
    });
  }
});
