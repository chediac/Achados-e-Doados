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
      return;
    }

    if (user.tipo !== 'DOADOR') {
      setMessage('Apenas usuários do tipo Doador podem registrar intenção de doação.');
      return;
    }

    setDoingDonate(true);
    try {
      const token = getToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // use query params doadorId (backend will resolve token if available)
      const url = `/api/doacoes?doadorId=${user.id}&demandaId=${id}`;
      const res = await fetch(url, { method: 'POST', headers });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Erro ao registrar intenção');
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">Carregando...</main>
      <Footer />
    </div>
  );

  if (error || !demanda) return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">Erro: {error}</main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-2">{demanda.titulo}</h1>
          <div className="text-sm text-gray-500 mb-4">Categoria: {demanda.categoria} • Urgência: {demanda.nivelUrgencia || '—'}</div>
          <p className="text-gray-700 mb-4">{demanda.descricao}</p>
          <div className="text-sm text-gray-600 mb-4">Quantidade: {demanda.quantidadeDescricao || '—'}</div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold">Instituição</h2>
            <div className="mt-2">
              <div className="font-medium">{demanda.instituicao?.nome}</div>
              <div className="text-sm text-gray-600">Endereço: {demanda.instituicao?.endereco || '—'}</div>
            </div>

            {showContact ? (
              <div className="mt-3 p-3 bg-green-50 border rounded">
                <div><strong>Contato:</strong></div>
                <div>Email: {demanda.instituicao?.email}</div>
                <div>Telefone: {demanda.instituicao?.telefone || '—'}</div>
              </div>
            ) : null}

            <div className="mt-4 flex items-center space-x-2">
              <button onClick={handleDoar} disabled={doingDonate} className="px-4 py-2 bg-green-600 text-white rounded">
                {doingDonate ? 'Registrando...' : 'Doar (Declarar intenção)'}
              </button>
              <Link to="/" className="text-sm text-gray-600">Voltar</Link>
            </div>

            {message ? <div className="mt-3 text-sm text-blue-700">{message}</div> : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
