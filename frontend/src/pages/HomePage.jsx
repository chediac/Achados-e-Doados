// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getUser } from '../lib/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [demandas, setDemandas] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState(null);

  useEffect(() => {
    // Buscar instituições para o filtro
    fetchInstituicoes();
    
    // Verificar se há filtro de instituição na URL
    const instituicaoId = searchParams.get('instituicao');
    if (instituicaoId) {
      setInstituicaoSelecionada(instituicaoId);
      fetchDemandas(null, instituicaoId);
    } else {
      fetchDemandas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchInstituicoes() {
    try {
      const res = await fetch('/api/instituicoes');
      if (res.ok) {
        const data = await res.json();
        setInstituicoes(data || []);
      }
    } catch (e) {
      console.error('Erro ao carregar instituições:', e);
    }
  }

  async function fetchDemandas(titulo, instituicaoId) {
    setLoading(true);
    try {
      let url = '/api/demandas';
      const params = new URLSearchParams();
      
      if (titulo) {
        params.append('titulo', titulo);
      }
      
      if (instituicaoId) {
        // Filtrar localmente pois a API não tem esse filtro
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erro ao carregar demandas');
        const data = await res.json();
        const filtered = data.filter(d => d.instituicao?.id === parseInt(instituicaoId));
        setDemandas(filtered || []);
      } else {
        if (params.toString()) {
          url += '?' + params.toString();
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erro ao carregar demandas');
        const data = await res.json();
        setDemandas(data || []);
      }
    } catch (e) {
      console.error(e);
      setDemandas([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchDemandas(q, instituicaoSelecionada);
  }

  function handleInstituicaoChange(instituicaoId) {
    setInstituicaoSelecionada(instituicaoId);
    if (instituicaoId) {
      setSearchParams({ instituicao: instituicaoId });
    } else {
      setSearchParams({});
    }
    fetchDemandas(q, instituicaoId);
  }

  function clearFilters() {
    setInstituicaoSelecionada(null);
    setQ('');
    setSearchParams({});
    fetchDemandas();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Achados & Doados</h1>
            <p className="text-xl text-blue-100 mb-8">
              Conectando corações generosos com quem mais precisa
            </p>
            
            {/* Barra de Pesquisa no Hero */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2 bg-white rounded-lg shadow-xl p-2">
                <input 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  type="text" 
                  placeholder="🔍 Pesquisar demandas por título..." 
                  className="flex-1 px-4 py-3 text-gray-800 bg-transparent focus:outline-none"
                />
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold mb-2">{demandas.length}</div>
              <div className="text-blue-100">Demandas Ativas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold mb-2">
                {new Set(demandas.map(d => d.instituicao?.id)).size}
              </div>
              <div className="text-blue-100">Instituições</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold mb-2">
                {new Set(demandas.map(d => d.categoria)).size}
              </div>
              <div className="text-blue-100">Categorias</div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <section>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {instituicaoSelecionada 
                  ? `Demandas de ${instituicoes.find(i => i.id === parseInt(instituicaoSelecionada))?.nome || 'Instituição'}`
                  : 'Demandas Recentes'
                }
              </h2>
              <p className="text-gray-600">
                Descubra como você pode fazer a diferença hoje
              </p>
            </div>

            {/* Filtro de Instituição */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={instituicaoSelecionada || ''}
                  onChange={(e) => handleInstituicaoChange(e.target.value || null)}
                  className="appearance-none px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700 font-medium min-w-[250px]"
                >
                  <option value="">🏢 Todas as Instituições</option>
                  {instituicoes.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.nome}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Botão para limpar filtros */}
              {(instituicaoSelecionada || q) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  title="Limpar filtros"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Badge de filtro ativo */}
          {instituicaoSelecionada && (
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                <span>🔍</span>
                Filtrando por: {instituicoes.find(i => i.id === parseInt(instituicaoSelecionada))?.nome}
                <button
                  onClick={() => handleInstituicaoChange(null)}
                  className="ml-2 hover:bg-blue-200 rounded-full p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando demandas...</p>
              </div>
            </div>
          ) : demandas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Nenhuma demanda encontrada
              </h3>
              <p className="text-gray-600">
                Tente ajustar seus filtros ou volte mais tarde
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demandas.map(d => (
                <Link 
                  key={d.id} 
                  to={`/demandas/${d.id}`} 
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 transform hover:-translate-y-1"
                >
                  {/* Badge de Urgência */}
                  <div className="relative">
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white z-10 ${
                      d.nivelUrgencia === 'Alta' ? 'bg-red-500' : 
                      d.nivelUrgencia === 'Média' ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}>
                      {d.nivelUrgencia === 'Alta' ? '🔥' : d.nivelUrgencia === 'Média' ? '⚡' : '✓'} {d.nivelUrgencia || 'Baixa'}
                    </div>
                    
                    {/* Header com Instituição */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        {d.instituicao?.fotoUrl ? (
                          <img 
                            src={`http://localhost:8080${d.instituicao.fotoUrl}`} 
                            alt={d.instituicao.nome}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl">
                            🏢
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-gray-800 block truncate">
                            {d.instituicao?.nome || 'Instituição'}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                            Verificada
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {d.titulo}
                    </h3>
                    
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-3">
                      {d.categoria === 'Alimentos' ? '🍎' : 
                       d.categoria === 'Roupas' ? '👕' : 
                       d.categoria === 'Brinquedos' ? '🧸' : 
                       d.categoria === 'Materiais de Higiene' ? '🧼' : 
                       d.categoria === 'Materiais Escolares' ? '📚' : '📦'} {d.categoria}
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {d.descricao || 'Sem descrição disponível'}
                    </p>

                    {/* Informações Adicionais */}
                    <div className="space-y-2 border-t border-gray-100 pt-4">
                      {d.quantidadeDescricao && (
                        <div className="flex items-start gap-2 text-sm">
                          <span className="text-gray-400">📊</span>
                          <span className="text-gray-700 flex-1">{d.quantidadeDescricao}</span>
                        </div>
                      )}
                      {d.prazoDesejado && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">📅</span>
                          <span className="text-gray-700">
                            Até {new Date(d.prazoDesejado).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Call to Action */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 flex items-center gap-2">
                        Ver detalhes
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}