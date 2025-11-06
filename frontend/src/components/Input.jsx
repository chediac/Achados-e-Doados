// src/components/Input.jsx
import React from 'react';

export function Input({ id, name, type = 'text', placeholder, value, onChange, label, required, disabled, ...props }) {
  // Garantir que value nunca seja undefined ou null (React reclama)
  const safeValue = value ?? '';
  
  return (
    <div className="w-full">
      {/* Label que fica acima do input */}
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id || name}
        name={name}
        placeholder={placeholder}
        value={safeValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
        // Classes de estilo do Tailwind para o input
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        {...props}
      />
    </div>
  );
}

// compatibility default export
export default Input;