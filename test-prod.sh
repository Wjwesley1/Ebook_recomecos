#!/bin/bash

echo "Testando Página Inicial..."
curl -s -o page.html https://ebook-recomecos-frontend.onrender.com/
if grep -q "Recomeços" page.html && grep -q "R\$19,90" page.html && grep -q "Uma leitura transformadora" page.html; then
  echo "Página Inicial: OK"
else
  echo "Página Inicial: FALHOU"
  exit 1
fi

echo "Testando Checkout..."
curl -s -o checkout.html https://ebook-recomecos-frontend.onrender.com/checkout
if grep -q "Voltar à Home" checkout.html && grep -q "Finalizar Compra" checkout.html; then
  echo "Checkout: OK"
else
  echo "Checkout: FALHOU"
  exit 1
fi

echo "Testando API de Pedido (Pix)..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://ebook-recomecos-backend.onrender.com/api/pedido \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678909",
    "endereco": "Rua Exemplo, 123, Centro, São Paulo, SP",
    "livroId": 1,
    "amount": 19.90,
    "paymentMethod": "pix"
  }')
if [ "$STATUS" -eq 200 ]; then
  echo "API de Pedido (Pix): OK"
else
  echo "API de Pedido (Pix): FALHOU (Status: $STATUS)"
  exit 1
fi

echo "Testando Mensagem de Sucesso..."
curl -s -o success.html https://ebook-recomecos-frontend.onrender.com/?sucesso=1
if grep -q "Pagamento realizado com sucesso" success.html; then
  echo "Mensagem de Sucesso: OK"
else
  echo "Mensagem de Sucesso: FALHOU"
  exit 1
fi

echo "Todos os testes passaram!"