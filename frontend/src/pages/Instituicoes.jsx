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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">Instituições</h1>
        {loading && <p>Carregando instituições...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lista.map((inst) => (
            <div key={inst.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{inst.nome}</h3>
              {inst.endereco && <p className="text-sm text-gray-600">{inst.endereco}</p>}
              <p className="text-sm">E-mail: {inst.email}</p>
              {inst.telefone && <p className="text-sm">Telefone: {inst.telefone}</p>}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Instituicoes;
