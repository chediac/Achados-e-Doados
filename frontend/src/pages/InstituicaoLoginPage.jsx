// src/pages/InstituicaoLoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Baseado no Wireframe (página 10)
export function InstituicaoLoginPage() {
  return (
    <div>
      <h2>Portal da Instituição</h2>
      <p>Gerencie suas necessidades e doações</p>
      
      <form>
        <label htmlFor="email">E-mail Institucional</label>
        <input id="email" type="email" placeholder="bjhjh@gmail.com" />

        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" />

        <button type="submit">Entrar no Portal</button>
        <a href="#">Esqueceu sua senha?</a>
      </form>
      
      <p>Sua instituição não está cadastrada? <Link to="/cadastro/instituicao">Cadastre-se</Link></p>
    </div>
  );
}