'use client';

import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageWithFallback({ src, alt, className }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  console.log('ImageWithFallback renderizado', imgSrc); // Debug

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc('/fallback.jpg')} // Fallback local
    />
  );
}