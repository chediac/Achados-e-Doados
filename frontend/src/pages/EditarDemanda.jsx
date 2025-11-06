import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { DemandaForm } from '../components/DemandaForm';
import { getUser } from '../lib/auth';

export function EditarDemanda() {
  const navigate = useNavigate();
  const { demandaId } = useParams();
  const [user] = useState(() => getUser()); // Usar useState para manter referência estável

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Alimentos',
    quantidadeDescricao: '',
    nivelUrgencia: 'Média',
    prazoDesejado: '',
    metaNumerica: '',
    status: 'ABERTA'
  });

  useEffect(() => {
    const fetchDemanda = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/demandas/${demandaId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Verificar se a instituição é dona da demanda
          if (data.instituicao?.id !== user?.id) {
            alert('Você não tem permissão para editar esta demanda');
            navigate('/portal/minhas-demandas');
            return;
          }

          setFormData({
            titulo: data.titulo || '',
            descricao: data.descricao || '',
            categoria: data.categoria || 'Alimentos',
            quantidadeDescricao: data.quantidadeDescricao || '',
            nivelUrgencia: data.nivelUrgencia || 'Média',
            prazoDesejado: data.prazoDesejado || '',
            metaNumerica: data.metaNumerica || '',
            status: data.status || 'ABERTA'
          });
        } else {
          alert('Erro ao carregar demanda');
          navigate('/portal/minhas-demandas');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar demanda');
        navigate('/portal/minhas-demandas');
      } finally {
        setLoading(false);
      }
    };

    fetchDemanda();
  }, [demandaId]); // Remover user e navigate das dependências

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== Tentando salvar demanda ===');
    console.log('DemandaId:', demandaId);
    console.log('UserId:', user?.id);
    console.log('FormData:', formData);
    
    setSaving(true);

    try {
      const token = localStorage.getItem('auth.token');
      console.log('Token existe:', !!token);
      
      const url = `http://localhost:8080/api/portal/instituicoes/${user.id}/demandas/${demandaId}`;
      console.log('URL:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Sucesso:', data);
        alert('Demanda atualizada com sucesso!');
        navigate('/portal/minhas-demandas');
      } else {
        let errorMessage = `Erro ${response.status}`;
        try {
          const error = await response.text();
          errorMessage = error || errorMessage;
        } catch (e) {
          // Resposta vazia
        }
        console.error('Erro na resposta:', errorMessage);
        alert('Erro ao atualizar demanda: ' + errorMessage);
        setSaving(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar demanda: ' + error.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Editar Demanda</h1>

          <DemandaForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            saving={saving}
            submitLabel="Salvar Alterações"
            onCancel={() => navigate('/portal/minhas-demandas')}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EditarDemanda;
