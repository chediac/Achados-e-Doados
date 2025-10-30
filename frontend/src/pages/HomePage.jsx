// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100"> {/* Fundo cinza claro */}
      
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-700">Achados e Doados</div> {/* Texto azul */}
          <div className="space-x-4">
            <span className="text-gray-700 hover:text-blue-700">Início</span>
            <span className="text-gray-700 hover:text-blue-700">Instituições</span>
            
            <Link to="/login">
              <button className="px-4 py-2 text-blue-700 border border-blue-700 rounded hover:bg-blue-50">
                Entrar
              </button>
            </Link>
            <Link to="/instituicao/login">
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"> {/* Fundo verde */}
                Sou Instituição
              </button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6">
        <section className="text-center py-20 bg-blue-700 text-white my-8 rounded-lg"> {/* Fundo azul */}
          <h1 className="text-5xl font-bold mb-4">Conectamos corações generosos com quem mais precisa.</h1>
          <p className="text-lg mb-8">Descubra instituições próximas e faça a diferença na sua comunidade.</p>
          
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto flex space-x-4">
            <input 
              type="text" 
              placeholder="O que você gostaria de doar?" 
              className="flex-1 p-2 border rounded text-gray-900" 
            />
            <input 
              type="text" 
              placeholder="Sua localização" 
              className="flex-1 p-2 border rounded text-gray-900" 
            />
            <button className="px-6 py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600"> {/* Fundo amarelo */}
              Encontrar Instituições
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-white mt-12 p-6 text-center text-gray-600">
        <p>© 2025 Achados e Doados</p>
      </footer>
    </div>
  );
}