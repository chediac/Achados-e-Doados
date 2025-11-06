// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../lib/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';

export function HomePage() {
  const [demandas, setDemandas] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDemandas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDemandas(titulo) {
    setLoading(true);
    try {
      const url = titulo ? `/api/demandas?titulo=${encodeURIComponent(titulo)}` : '/api/demandas';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao carregar demandas');
      const data = await res.json();
      setDemandas(data || []);
    } catch (e) {
      console.error(e);
      setDemandas([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchDemandas(q);
  }

  const user = getUser();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Demandas Recentes</h1>
          <p className="text-gray-600 mb-4">Veja pedidos que instituições publicaram — filtre pelo título.</p>

          <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
            <input value={q} onChange={e => setQ(e.target.value)} type="text" placeholder="Pesquisar por título" className="flex-1 p-2 border rounded" />
            <button className="px-4 py-2 bg-blue-700 text-white rounded">Buscar</button>
          </form>

          {loading ? (
            <div>Carregando...</div>
          ) : demandas.length === 0 ? (
            <div className="text-gray-600">Nenhuma demanda encontrada.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demandas.map(d => (
                <Link key={d.id} to={`/demandas/${d.id}`} className="block bg-white p-4 rounded shadow hover:shadow-md transition">
                  <h3 className="text-xl font-semibold">{d.titulo}</h3>
                  <div className="text-sm text-gray-500">Categoria: {d.categoria} • Urgência: {d.nivelUrgencia || '—'}</div>
                  <p className="mt-2 text-gray-700">{d.descricao?.length > 200 ? d.descricao.substring(0, 200) + '…' : d.descricao}</p>
                  <div className="mt-3 text-sm text-gray-600">Quantidade: {d.quantidadeDescricao || '—'}</div>
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