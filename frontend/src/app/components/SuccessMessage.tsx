"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessMessage() {
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (searchParams && searchParams.get('sucesso') === '1') {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!showSuccessMessage) return null;

  return (
    <div className="success-message">
      Pagamento confirmado! O e-book será enviado para o seu e-mail em breve.
    </div>
  );
}