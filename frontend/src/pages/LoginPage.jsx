// src/pages/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Baseado no Wireframe (página 8)
export function LoginPage() { // <--- A palavra 'export' AQUI é essencial
  return (
    <div>
      <h2>Bem-vindo de volta!</h2>
      <p>Entre na sua conta para continuar ajudando</p>
      
      <form>
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" placeholder="matheus@gmail.com" />

        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" />

        <button type="submit">Entrar</button>
        <a href="#">Esqueceu sua senha?</a>
      </form>
      
      <p>Não tem uma conta? <Link to="/cadastro/doador">Cadastre-se</Link></p>
    </div>
  );
}