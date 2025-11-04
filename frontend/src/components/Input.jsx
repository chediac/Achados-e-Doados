// src/components/Input.jsx
import React from 'react';

export function Input({ id, type = 'text', placeholder, value, onChange, label }) {
  return (
    <div className="w-full">
      {/* Label que fica acima do input */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // Classes de estilo do Tailwind para o input
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

// compatibility default export
export default Input;