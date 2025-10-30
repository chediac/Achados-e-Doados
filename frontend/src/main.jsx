// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// Fallback for a few Tailwind utilities (temporary)
import './custom-tailwind-fallback.css';
import { BrowserRouter } from 'react-router-dom'; // 1. Importar

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolver o <App /> com o BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);