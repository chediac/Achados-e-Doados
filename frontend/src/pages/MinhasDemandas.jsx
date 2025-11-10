import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUser, getToken } from '../lib/auth';

export default function MinhasDemandas() {
  const navigate = useNavigate();
  const [user] = useState(() => getUser());
  const [demandas, setDemandas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDemandaId, setExpandedDemandaId] = useState(null);
  const [doacoesPorDemanda, setDoacoesPorDemanda] = useState({});
  const [loadingDoacoes, setLoadingDoacoes] = useState({});

  useEffect(() => {
    if (!user || user.tipo !== 'INSTITUICAO') {
      navigate('/');
      return;
    }
    carregarMinhasDemandas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function carregarMinhasDemandas() {
    setLoading(true);
    try {
      const token = getToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/portal/instituicoes/${user.id}/demandas`, { headers });
      if (!res.ok) throw new Error('Erro ao carregar demandas');
      const data = await res.json();
      setDemandas(data || []);
    } catch (e) {
      console.error(e);
      setError('Erro ao carregar suas demandas');
    } finally {
      setLoading(false);
    }
  }

  async function carregarDoacoesDaDemanda(demandaId) {
    if (doacoesPorDemanda[demandaId]) {
      // Já carregou, apenas expande/contrai
      setExpandedDemandaId(expandedDemandaId === demandaId ? null : demandaId);
      return;
    }

    setLoadingDoacoes(prev => ({ ...prev, [demandaId]: true }));
    try {
      const res = await fetch(`/api/doacoes/demanda/${demandaId}`);
      if (!res.ok) throw new Error('Erro ao carregar doações');
      const data = await res.json();
      setDoacoesPorDemanda(prev => ({ ...prev, [demandaId]: data }));
      setExpandedDemandaId(demandaId);
    } catch (e) {
      console.error(e);
      alert('Erro ao carregar doações desta demanda');
    } finally {
      setLoadingDoacoes(prev => ({ ...prev, [demandaId]: false }));
    }
  }

  async function handleDelete(demandaId) {
    if (!window.confirm('Tem certeza que deseja deletar esta demanda? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(
        `/api/portal/instituicoes/${user.id}/demandas/${demandaId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert('Demanda deletada com sucesso!');
        // Atualizar lista de demandas
        setDemandas(prev => prev.filter(d => d.id !== demandaId));
      } else {
        alert('Erro ao deletar demanda');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar demanda');
    }
  }

  if (!user || user.tipo !== 'INSTITUICAO') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Minhas Demandas</h1>
              <p className="text-purple-100">Gerencie suas solicitações de doação</p>
            </div>
            <button
              onClick={() => navigate('/portal/demandas/novo')}
              className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-xl">➕</span>
              Nova Demanda
            </button>
          </div>

          {/* Estatísticas */}
          {!loading && demandas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{demandas.length}</div>
                <div className="text-purple-100 text-sm">Total de Demandas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {demandas.filter(d => d.status === 'ABERTA').length}
                </div>
                <div className="text-purple-100 text-sm">Demandas Abertas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {Object.values(doacoesPorDemanda).reduce((acc, doacoes) => acc + doacoes.length, 0)}
                </div>
                <div className="text-purple-100 text-sm">Intenções Recebidas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {demandas.filter(d => d.nivelUrgencia === 'Alta').length}
                </div>
                <div className="text-purple-100 text-sm">Urgentes</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando suas demandas...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        ) : demandas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-7xl mb-6">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Nenhuma demanda publicada ainda
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Comece a receber doações criando sua primeira demanda. É rápido e fácil!
            </p>
            <button
              onClick={() => navigate('/portal/demandas/novo')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <span className="text-xl">✨</span>
              Publicar Primeira Demanda
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {demandas.map(demanda => {
              const doacoes = doacoesPorDemanda[demanda.id] || [];
              const isExpanded = expandedDemandaId === demanda.id;
              
              return (
                <div 
                  key={demanda.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
                >
                  {/* Header do Card */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <h2 className="text-2xl font-bold text-gray-800 flex-1">
                            {demanda.titulo}
                          </h2>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                            demanda.nivelUrgencia === 'Alta' ? 'bg-red-500 text-white' : 
                            demanda.nivelUrgencia === 'Média' ? 'bg-yellow-500 text-white' : 
                            'bg-green-500 text-white'
                          }`}>
                            {demanda.nivelUrgencia === 'Alta' ? '🔥' : 
                             demanda.nivelUrgencia === 'Média' ? '⚡' : '✓'} {demanda.nivelUrgencia || 'Baixa'}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {demanda.categoria === 'Alimentos' ? '🍎' : 
                             demanda.categoria === 'Roupas' ? '👕' : 
                             demanda.categoria === 'Brinquedos' ? '🧸' : 
                             demanda.categoria === 'Materiais de Higiene' ? '🧼' : 
                             demanda.categoria === 'Materiais Escolares' ? '📚' : '📦'} {demanda.categoria}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${
                            demanda.status === 'ABERTA' ? 'bg-green-100 text-green-700' :
                            demanda.status === 'EM_PROGRESSO' ? 'bg-yellow-100 text-yellow-700' :
                            demanda.status === 'CONCLUIDA' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            📌 {demanda.status === 'ABERTA' ? 'Aberta' :
                                demanda.status === 'EM_PROGRESSO' ? 'Em Progresso' :
                                demanda.status === 'CONCLUIDA' ? 'Concluída' :
                                demanda.status || 'Aberta'}
                          </span>
                          {doacoes.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                              ❤️ {doacoes.length} {doacoes.length === 1 ? 'Intenção' : 'Intenções'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <p className="text-gray-700 mb-4 line-clamp-2">{demanda.descricao}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 rounded-lg p-4 mb-4">
                      {demanda.quantidadeDescricao && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">📊</span>
                          <span className="text-gray-700">{demanda.quantidadeDescricao}</span>
                        </div>
                      )}
                      {demanda.prazoDesejado && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">📅</span>
                          <span className="text-gray-700">
                            Até {new Date(demanda.prazoDesejado).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                      {demanda.metaNumerica && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">🎯</span>
                          <span className="text-gray-700">Meta: {demanda.metaNumerica}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">🆔</span>
                        <span className="text-gray-700">ID: #{demanda.id}</span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => carregarDoacoesDaDemanda(demanda.id)}
                        disabled={loadingDoacoes[demanda.id]}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg font-medium transition-colors"
                      >
                        {loadingDoacoes[demanda.id] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                            Carregando...
                          </>
                        ) : isExpanded ? (
                          <>
                            <span>▼</span> Ocultar Intenções
                          </>
                        ) : (
                          <>
                            <span>▶</span> Ver Intenções ({doacoes.length})
                          </>
                        )}
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/portal/demandas/${demanda.id}/editar`)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <span>✏️</span> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(demanda.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <span>🗑️</span> Deletar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Seção Expandida - Intenções de Doação */}
                  {isExpanded && doacoes && (
                    <div className="border-t bg-gradient-to-r from-purple-50 to-blue-50 p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">❤️</span>
                        Intenções de Doação ({doacoes.length})
                      </h3>
                      {doacoes.length === 0 ? (
                        <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                          <div className="text-5xl mb-3">🔔</div>
                          <p className="text-gray-600">
                            Ainda não há doadores interessados nesta demanda.
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Compartilhe sua demanda para alcançar mais pessoas!
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {doacoes.map(doacao => (
                            <div
                              key={doacao.id}
                              className="bg-white p-5 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                                    {(doacao.doador?.nome || 'D')[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {doacao.doador?.nome || 'Doador anônimo'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(doacao.data).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </div>
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  doacao.status === 'Aguardando' ? 'bg-yellow-100 text-yellow-800' :
                                  doacao.status === 'Recebida' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {doacao.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                                <span>✉️</span>
                                <a 
                                  href={`mailto:${doacao.doador?.email}`}
                                  className="hover:text-blue-600 truncate flex-1"
                                >
                                  {doacao.doador?.email || '—'}
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
