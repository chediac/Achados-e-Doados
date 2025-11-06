import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Instituicoes() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInstitutions() {
      setLoading(true);
      try {
        const res = await fetch('/api/instituicoes');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setLista(data);
      } catch (err) {
        setError(err.message || 'Erro ao buscar instituições');
      } finally {
        setLoading(false);
      }
    }
    fetchInstitutions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h1 className="text-5xl font-bold mb-4">Nossas Instituições</h1>
            <p className="text-xl text-green-100 mb-8">
              Conheça as organizações que estão fazendo a diferença
            </p>
          </div>

          {/* Estatísticas */}
          {!loading && lista.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">{lista.length}</div>
                <div className="text-green-100">Instituições Ativas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">
                  {lista.filter(i => i.fotoUrl).length}
                </div>
                <div className="text-green-100">Com Perfil Completo</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold mb-2">
                  {lista.filter(i => i.telefone).length}
                </div>
                <div className="text-green-100">Com Telefone</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="flex-grow container mx-auto px-6 py-12 max-w-7xl">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando instituições...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        ) : lista.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <div className="text-7xl mb-6">🏢</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Nenhuma instituição cadastrada ainda
            </h2>
            <p className="text-gray-600">
              Seja a primeira instituição a se cadastrar e começar a receber doações!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Todas as Instituições
              </h2>
              <p className="text-gray-600">
                Encontre uma causa para apoiar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lista.map((inst) => (
                <div 
                  key={inst.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-300 transform hover:-translate-y-1 group"
                >
                  {/* Header com Foto */}
                  <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 p-6 pb-20">
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                      {inst.fotoUrl ? (
                        <img 
                          src={`http://localhost:8080${inst.fotoUrl}`} 
                          alt={inst.nome}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center border-4 border-white shadow-xl group-hover:scale-110 transition-transform">
                          <span className="text-4xl">🏢</span>
                        </div>
                      )}
                    </div>
                    {/* Badge Verificada */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        <span className="inline-block w-2 h-2 bg-white rounded-full"></span>
                        Verificada
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="pt-16 pb-6 px-6 text-center">
                    <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                      {inst.nome}
                    </h3>
                    
                    <div className="space-y-3">
                      {inst.endereco && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                          <span className="text-lg flex-shrink-0">📍</span>
                          <p className="text-left flex-1">{inst.endereco}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        <span className="text-lg">✉️</span>
                        <a 
                          href={`mailto:${inst.email}`}
                          className="hover:text-green-600 truncate flex-1 text-left"
                        >
                          {inst.email}
                        </a>
                      </div>
                      
                      {inst.telefone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                          <span className="text-lg">📱</span>
                          <a 
                            href={`tel:${inst.telefone}`}
                            className="hover:text-green-600 flex-1 text-left"
                          >
                            {inst.telefone}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <span>🆔</span>
                        <span>ID: #{inst.id}</span>
                      </div>
                    </div>

                    {/* Botão de Ação */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <a
                        href={`/demandas?instituicao=${inst.id}`}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                      >
                        <span>📋</span>
                        Ver Demandas
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Instituicoes;
