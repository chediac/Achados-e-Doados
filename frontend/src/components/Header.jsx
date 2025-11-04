// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, clearToken, clearUser } from '../lib/auth';

export function Header() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearToken();
    clearUser();
    navigate('/login');
  };
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Usamos um Link na logo para voltar para a Home */}
        <Link to="/" className="text-xl font-bold text-blue-700">
          Achados e Doados
        </Link>
        
        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-700">
            Início
          </Link>
          <span className="text-gray-700 hover:text-blue-700">Instituições</span>

          {!user && (
            <>
              <Link to="/login">
                <button className="px-4 py-2 text-blue-700 border border-blue-700 rounded hover:bg-blue-50">
                  Entrar
                </button>
              </Link>
              <Link to="/instituicao/login">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Sou Instituição
                </button>
              </Link>
            </>
          )}

          {user && (
            <>
              {user.tipo === 'INSTITUICAO' && (
                <Link to="/portal/demandas/novo">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2">Publicar Demanda</button>
                </Link>
              )}
              <Link to="/perfil" className="text-gray-700 hover:text-blue-700">Perfil</Link>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Sair</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

// compatibility default export
export default Header;