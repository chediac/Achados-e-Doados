// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // 1. Importar o Link

export function HomePage() {
  return (
    <div className="home-container">
      <header>
        {/* TODO: Criar componente Header */}
        <span>Início</span>
        <span>Instituições</span>
        
        {/* 2. Usar <Link> para navegação */}
        <Link to="/login">
          <button>Entrar</button>
        </Link>
        <Link to="/instituicao/login">
          <button>Sou Instituição</button>
        </Link>
      </header>

      <main>
        <section className="hero">
          <h1>Conectamos corações generosos com quem mais precisa.</h1>
          <p>Descubra instituições próximas e faça a diferença na sua comunidade.</p>
          
          <div className="search-bar">
            {/* TODO: Criar componente de Busca */}
            <input type="text" placeholder="O que você gostaria de doar?" />
            <input type="text" placeholder="Sua localização" />
            <button>Encontrar Instituições</button>
          </div>
        </section>
      </main>

      <footer>
        {/* TODO: Criar componente Footer */}
        <p>© 2025 Achados e Doados</p>
      </footer>
    </div>
  );
}