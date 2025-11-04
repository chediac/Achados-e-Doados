// src/components/Button.jsx
import React from 'react';

export function Button({ children, onClick, type = 'button', className = '', disabled = false }) {
  // Estilos base que todo botão terá
  const baseStyle = "w-full px-4 py-2 rounded-md font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Estilo padrão (azul), caso nenhum 'className' de cor seja passado
  const defaultStyle = "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      // Combina os estilos: base + (estilo passado via props OU estilo padrão)
      className={`${baseStyle} ${className || defaultStyle} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

// For compatibility: also provide a default export
export default Button;