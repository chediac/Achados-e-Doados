import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, apiPost, getToken } from '../lib/auth';

export function CriarDemanda() {
  const navigate = useNavigate();
  const user = getUser();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidadeDescricao, setQuantidadeDescricao] = useState('');
  const [nivelUrgencia, setNivelUrgencia] = useState('Média');
  const [prazoDesejado, setPrazoDesejado] = useState('');
  const [metaNumerica, setMetaNumerica] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!user) {
    // If not logged, redirect to login
    navigate('/login');
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        titulo,
        categoria,
        descricao,
        quantidadeDescricao,
        nivelUrgencia,
        prazoDesejado: prazoDesejado || null,
        metaNumerica: metaNumerica ? Number(metaNumerica) : null,
      };

      // Use the API helper to include token header
      const instituicaoId = user.id;
      const token = getToken();
      const res = await fetch(`/api/portal/instituicoes/${instituicaoId}/demandas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const saved = await res.json();
        // Redirect to profile or home after create
        navigate('/perfil');
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.message || `Erro ao criar demanda (status ${res.status})`);
      }
    } catch (err) {
      console.error(err);
      setError('Erro desconhecido ao criar demanda');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-2xl font-bold mb-4">Publicar nova demanda</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-2xl">
          {error && <div className="mb-4 text-red-600">{error}</div>}

          <label className="block mb-2">Título</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full p-2 border rounded mb-4" />

          <label className="block mb-2">Categoria</label>
          <input value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full p-2 border rounded mb-4" />

          <label className="block mb-2">Descrição</label>
          <textarea value={descricao} onChange={e => setDescricao(e.target.value)} className="w-full p-2 border rounded mb-4" rows={6} />

          <label className="block mb-2">Quantidade (descrição)</label>
          <input value={quantidadeDescricao} onChange={e => setQuantidadeDescricao(e.target.value)} className="w-full p-2 border rounded mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-2">Nível de urgência</label>
              <select value={nivelUrgencia} onChange={e => setNivelUrgencia(e.target.value)} className="w-full p-2 border rounded">
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Prazo desejado</label>
              <input type="date" value={prazoDesejado} onChange={e => setPrazoDesejado(e.target.value)} className="w-full p-2 border rounded" />
            </div>

            <div>
              <label className="block mb-2">Meta numérica (opcional)</label>
              <input type="number" value={metaNumerica} onChange={e => setMetaNumerica(e.target.value)} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div className="flex space-x-2">
            <button disabled={saving} className="px-4 py-2 bg-blue-700 text-white rounded">{saving ? 'Salvando...' : 'Publicar'}</button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CriarDemanda;
