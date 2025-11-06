import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUser, getToken } from '../lib/auth';

export default function DemandaDetail() {
  const { id } = useParams();
  const [demanda, setDemanda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [doingDonate, setDoingDonate] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/demandas/${id}`);
        if (!res.ok) throw new Error('Demanda não encontrada');
        const data = await res.json();
        setDemanda(data);
      } catch (e) {
        setError(e.message || 'Erro');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const user = getUser();

  async function handleDoar() {
    // reveal contact immediately
    setShowContact(true);
    setMessage(null);

    // if user not logged, prompt to login
    if (!user) {
      setMessage('Faça login como doador para registrar sua intenção.');
      setDoingDonate(false);
      return;
    }

    if (user.tipo !== 'DOADOR') {
      setMessage('Apenas usuários do tipo Doador podem registrar intenção de doação.');
      setDoingDonate(false);
      return;
    }

    setDoingDonate(true);
    try {
      const token = getToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // use query params doadorId (backend will resolve token if available)
      const url = `/api/doacoes?doadorId=${user.id}&demandaId=${id}`;
      const res = await fetch(url, { method: 'POST', headers });
      if (!res.ok) {
        let errorMsg = `Erro ${res.status}`;
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          const text = await res.text();
          errorMsg = text || errorMsg;
        }
        throw new Error(errorMsg);
      }
      const created = await res.json();
      setMessage('Intenção registrada com sucesso. A instituição será notificada.');
    } catch (e) {
      console.error(e);
      setMessage('Erro ao registrar intenção: ' + (e.message || e));
    } finally {
      setDoingDonate(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando detalhes...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (error || !demanda) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ops! Algo deu errado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Voltar para o início
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para demandas
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Detalhes da Demanda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Principal */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              {/* Header com Badge */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    demanda.nivelUrgencia === 'Alta' ? 'bg-red-500' : 
                    demanda.nivelUrgencia === 'Média' ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}>
                    {demanda.nivelUrgencia === 'Alta' ? '🔥' : demanda.nivelUrgencia === 'Média' ? '⚡' : '✓'} 
                    {' '}{demanda.nivelUrgencia || 'Baixa'}
                  </div>
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    {demanda.categoria === 'Alimentos' ? '🍎' : 
                     demanda.categoria === 'Roupas' ? '👕' : 
                     demanda.categoria === 'Brinquedos' ? '🧸' : 
                     demanda.categoria === 'Materiais de Higiene' ? '🧼' : 
                     demanda.categoria === 'Materiais Escolares' ? '📚' : '📦'} {demanda.categoria}
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">{demanda.titulo}</h1>
                <p className="text-blue-100 text-sm">ID da Demanda: #{demanda.id}</p>
              </div>

              {/* Conteúdo */}
              <div className="p-6 space-y-6">
                {/* Descrição */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    Descrição
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {demanda.descricao || 'Sem descrição disponível'}
                  </p>
                </div>

                {/* Informações da Demanda */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  {demanda.quantidadeDescricao && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Quantidade Necessária</div>
                        <div className="text-gray-800">{demanda.quantidadeDescricao}</div>
                      </div>
                    </div>
                  )}
                  {demanda.prazoDesejado && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Prazo Desejado</div>
                        <div className="text-gray-800">
                          {new Date(demanda.prazoDesejado).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {demanda.metaNumerica && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Meta Numérica</div>
                        <div className="text-gray-800">{demanda.metaNumerica} unidades</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📌</span>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Status</div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        demanda.status === 'ABERTA' ? 'bg-green-100 text-green-700' :
                        demanda.status === 'EM_PROGRESSO' ? 'bg-yellow-100 text-yellow-700' :
                        demanda.status === 'CONCLUIDA' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {demanda.status === 'ABERTA' ? 'Aberta' :
                         demanda.status === 'EM_PROGRESSO' ? 'Em Progresso' :
                         demanda.status === 'CONCLUIDA' ? 'Concluída' :
                         demanda.status || 'Aberta'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Ação */}
            {message && (
              <div className={`rounded-lg p-4 ${
                message.includes('sucesso') 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {message.includes('sucesso') ? '✅' : 'ℹ️'}
                  </span>
                  <p className="flex-1">{message}</p>
                </div>
              </div>
            )}

            <button 
              onClick={handleDoar} 
              disabled={doingDonate}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {doingDonate ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Registrando intenção...
                </>
              ) : (
                <>
                  <span className="text-2xl">❤️</span>
                  Quero Doar - Declarar Intenção
                </>
              )}
            </button>
          </div>

          {/* Sidebar - Informações da Instituição */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 sticky top-6">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Instituição</h2>
                
                <div className="flex flex-col items-center text-center mb-4">
                  {demanda.instituicao?.fotoUrl ? (
                    <img 
                      src={`http://localhost:8080${demanda.instituicao.fotoUrl}`} 
                      alt={demanda.instituicao.nome}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-3"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl border-4 border-white shadow-lg mb-3">
                      🏢
                    </div>
                  )}
                  <h3 className="font-bold text-xl text-gray-800">{demanda.instituicao?.nome}</h3>
                  <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    Instituição Verificada
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {demanda.instituicao?.endereco && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📍</span>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 font-medium">Endereço</div>
                      <div className="text-gray-800 text-sm">{demanda.instituicao.endereco}</div>
                    </div>
                  </div>
                )}

                {showContact && (
                  <>
                    <div className="border-t pt-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-green-800 flex items-center gap-2">
                          <span>📞</span> Informações de Contato
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <span>✉️</span>
                            <a href={`mailto:${demanda.instituicao?.email}`} className="hover:text-blue-600 break-all">
                              {demanda.instituicao?.email}
                            </a>
                          </div>
                          {demanda.instituicao?.telefone && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <span>📱</span>
                              <a href={`tel:${demanda.instituicao.telefone}`} className="hover:text-blue-600">
                                {demanda.instituicao.telefone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {!showContact && (
                  <p className="text-sm text-gray-500 italic">
                    As informações de contato serão reveladas ao declarar intenção de doar
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
