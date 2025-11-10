import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function CadastroDoador() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCepBlur = async () => {
    if (!cep || cep.replace(/\D/g, '').length !== 8) return;
    
    setLoadingCep(true);
    try {
      const cepNumeros = cep.replace(/\D/g, '');
      const res = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
      const data = await res.json();
      
      if (!data.erro) {
        setCidade(data.localidade);
        setEstado(data.uf);
      } else {
        setError('CEP não encontrado');
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = { 
        nome, 
        email, 
        senha,
        cep: cep ? cep.replace(/\D/g, '') : undefined,
        cidade: cidade || undefined,
        estado: estado || undefined
      };
      const res = await fetch('/api/cadastro/doador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        // cadastro ok
        navigate('/login');
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.message || `Erro: status ${res.status}`);
      }
    } catch (err) {
      setError(err.message || 'Erro de rede');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Cadastre-se</h2>
          <p className="mt-2 text-sm text-gray-600 text-center">Crie sua conta para começar a doar</p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <Input 
              id="nome" 
              label="Nome completo" 
              value={nome} 
              onChange={(e)=>setNome(e.target.value)} 
              placeholder="Seu nome" 
              required 
            />

            <Input 
              id="email" 
              type="email" 
              label="E-mail" 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              placeholder="seu@email.com" 
              required 
            />

            <Input 
              id="senha" 
              type="password" 
              label="Senha" 
              value={senha} 
              onChange={(e)=>setSenha(e.target.value)} 
              placeholder="Crie uma senha" 
              required 
            />

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-4">Localização (opcional - ajuda a encontrar instituições próximas)</p>
              
              <Input 
                id="cep" 
                label="CEP" 
                value={cep} 
                onChange={(e)=>setCep(e.target.value)}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                disabled={loadingCep}
              />

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="col-span-2">
                  <Input 
                    id="cidade" 
                    label="Cidade" 
                    value={cidade} 
                    onChange={(e)=>setCidade(e.target.value)}
                  />
                </div>
                <Input 
                  id="estado" 
                  label="UF" 
                  value={estado} 
                  onChange={(e)=>setEstado(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div>
              <Button type="submit" disabled={loading} className="bg-yellow-500 text-white font-bold hover:bg-yellow-600">
                {loading ? 'Cadastrando…' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
