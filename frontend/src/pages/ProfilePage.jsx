import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { getUser, clearToken, clearUser } from '../lib/auth';

export function ProfilePage() {
  const navigate = useNavigate();
  const user = getUser();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.fotoUrl || null);

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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('foto', file);

      const token = localStorage.getItem('auth.token');
      
      const response = await fetch('/api/portal/instituicoes/foto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPhotoPreview(`http://localhost:8080${data.fotoUrl}`);
        
        const updatedUser = { ...user, fotoUrl: data.fotoUrl };
        localStorage.setItem('auth.user', JSON.stringify(updatedUser));
        
        alert('Foto atualizada com sucesso!');
      } else {
        let errorMessage = `Erro ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          // ignore
        }
        alert(errorMessage);
      }
    } catch {
      alert('Erro ao fazer upload da foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header do Perfil */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">
              {user?.tipo === 'INSTITUICAO' ? '🏢 Portal da Instituição' : '👤 Meu Perfil'}
            </h1>
            <p className="text-purple-100">
              Gerencie suas informações e configurações
            </p>
          </div>

          {/* Conteúdo do Perfil */}
          <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden">
            {user ? (
              <div className="p-8">
                {/* Foto de perfil para instituições */}
                {user?.tipo === 'INSTITUICAO' && (
                  <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
                    <div className="relative mb-6">
                      <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-purple-200 to-blue-200 ring-4 ring-white shadow-xl">
                        {photoPreview ? (
                          <img 
                            src={photoPreview} 
                            alt="Foto da instituição" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {uploadingPhoto && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <label className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer font-semibold transition-all ${
                      uploadingPhoto 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                    } text-white`}>
                      <span className="text-xl">📸</span>
                      {uploadingPhoto ? 'Enviando...' : 'Alterar Foto'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        disabled={uploadingPhoto}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-3">
                      Imagens PNG ou JPG (máx. 5MB)
                    </p>
                  </div>
                )}

                {/* Informações do Usuário */}
                <div className="space-y-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações Pessoais</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-5 border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">👤</span>
                        <label className="text-sm font-medium text-gray-600">Nome</label>
                      </div>
                      <p className="text-lg font-semibold text-gray-800 pl-11">{user.nome}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-5 border border-purple-100">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">✉️</span>
                        <label className="text-sm font-medium text-gray-600">E-mail</label>
                      </div>
                      <p className="text-lg font-semibold text-gray-800 pl-11 break-all">{user.email}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🎭</span>
                        <label className="text-sm font-medium text-gray-600">Tipo de Conta</label>
                      </div>
                      <p className="text-lg font-semibold text-gray-800 pl-11">
                        {user.tipo === 'INSTITUICAO' ? 'Instituição' : 'Doador'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-5 border border-yellow-100">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🆔</span>
                        <label className="text-sm font-medium text-gray-600">ID da Conta</label>
                      </div>
                      <p className="text-lg font-semibold text-gray-800 pl-11">#{user.id}</p>
                    </div>
                  </div>
                </div>

                {/* Ações Rápidas - Instituição */}
                {user?.tipo === 'INSTITUICAO' && (
                  <div className="border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Ações Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => navigate('/portal/minhas-demandas')}
                        className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all text-left group"
                      >
                        <div className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          📋
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg">Minhas Demandas</h3>
                          <p className="text-sm text-gray-600">Gerencie suas solicitações</p>
                        </div>
                        <svg className="w-6 h-6 text-green-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <button
                        onClick={() => navigate('/portal/demandas/novo')}
                        className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all text-left group"
                      >
                        <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          ➕
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg">Nova Demanda</h3>
                          <p className="text-sm text-gray-600">Publique uma solicitação</p>
                        </div>
                        <svg className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Ações Rápidas - Doador */}
                {user?.tipo === 'DOADOR' && (
                  <div className="border-t border-gray-200 pt-8">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center border-2 border-blue-200">
                      <div className="text-6xl mb-4">❤️</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Pronto para ajudar?</h3>
                      <p className="text-gray-600 mb-6">
                        Explore as demandas disponíveis e faça a diferença na vida de alguém
                      </p>
                      <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        Ver Demandas Disponíveis
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Botão de Logout */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <span className="text-xl">🚪</span>
                    Sair da Conta
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <p className="text-gray-600 text-lg">Nenhuma informação do usuário disponível.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  Fazer Login
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProfilePage;
