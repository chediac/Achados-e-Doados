import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { DemandaForm } from '../components/DemandaForm';
import { getUser, getToken } from '../lib/auth';

export function CriarDemanda() {
  const navigate = useNavigate();
  const user = getUser();
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'Alimentos',
    descricao: '',
    quantidadeDescricao: '',
    nivelUrgencia: 'Média',
    prazoDesejado: '',
    metaNumerica: '',
    status: 'ABERTA'
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        ...formData,
        prazoDesejado: formData.prazoDesejado || null,
        metaNumerica: formData.metaNumerica ? Number(formData.metaNumerica) : null,
      };

      const instituicaoId = user.id;
      const token = getToken();
      const res = await fetch(`http://localhost:8080/api/portal/instituicoes/${instituicaoId}/demandas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        alert('Demanda criada com sucesso!');
        navigate('/portal/minhas-demandas');
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.message || `Erro ao criar demanda (status ${res.status})`);
        setSaving(false);
      }
    } catch (err) {
      console.error(err);
      setError('Erro desconhecido ao criar demanda');
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Publicar Nova Demanda</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <DemandaForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            saving={saving}
            submitLabel="Publicar Demanda"
            onCancel={() => navigate('/portal/minhas-demandas')}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CriarDemanda;
