// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, clearToken, clearUser } from '../lib/auth';

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getUser());

  useEffect(() => {
    // Update when auth changes in the same tab
    function onAuth() {
      setUser(getUser());
    }
    // Listen to our custom event
    window.addEventListener('authChanged', onAuth);
    // Listen to storage events (other tabs)
    function onStorage(e) {
      if (e.key && (e.key === 'auth.user' || e.key === 'auth.token')) {
        setUser(getUser());
      }
    }
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('authChanged', onAuth);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleLogout = () => {
    clearToken();
    clearUser();
    setUser(null);
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
          <Link to="/instituicoes" className="text-gray-700 hover:text-blue-700">
            Instituições
          </Link>
          <Link to="/mapa" className="text-gray-700 hover:text-blue-700">
            Mapa
          </Link>

          {!user && (
            <>
              <Link to="/login">
                <button className="px-4 py-2 text-blue-700 border border-blue-700 rounded hover:bg-blue-50">
                  Entrar
                </button>
              </Link>
              <Link to="/instituicao">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Sou Instituição
                </button>
              </Link>
            </>
          )}

          {user && (
            <>
              {user.tipo === 'INSTITUICAO' && (
                <>
                  <Link to="/portal/minhas-demandas" className="text-gray-700 hover:text-blue-700">
                    Minhas Demandas
                  </Link>
                  <Link to="/portal/demandas/novo">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Publicar Demanda</button>
                  </Link>
                </>
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