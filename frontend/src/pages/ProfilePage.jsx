import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { getUser, clearToken, clearUser } from '../lib/auth';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = async () => {
    // opcional: avisar backend
    try {
      const token = localStorage.getItem('auth.token');
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        }).catch(() => {});
      }
    } finally {
      clearToken();
      clearUser();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Área do usuário</h2>
          {user ? (
            <div className="mt-4">
              <p><strong>Nome:</strong> {user.nome}</p>
              <p><strong>E-mail:</strong> {user.email}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-600">Nenhuma informação do usuário disponível.</p>
          )}

          <div className="mt-6">
            <button onClick={handleLogout} className="w-full px-4 py-2 bg-red-600 text-white rounded-md">Sair</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProfilePage;
