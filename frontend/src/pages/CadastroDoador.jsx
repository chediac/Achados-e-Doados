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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = { nome, email, senha };
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
            <Input id="nome" label="Nome completo" value={nome} onChange={(e)=>setNome(e.target.value)} placeholder="Seu nome" />

            <Input id="email" type="email" label="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="seu@email.com" />

            <Input id="senha" type="password" label="Senha" value={senha} onChange={(e)=>setSenha(e.target.value)} placeholder="Crie uma senha" />

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
