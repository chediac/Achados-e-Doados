// src/pages/InstituicaoLoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveToken, saveUser } from '../lib/auth';
import { Input } from '../components/Input';
import Button from '../components/Button';

// Área simples que permite alternar entre Login e link para cadastro da instituição.
export function InstituicaoLoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('login'); // 'login' | 'cadastro'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e && e.preventDefault();
    setError(null);
    if (!email || !senha) {
      setError('Preencha e-mail e senha');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        if (res.status === 401) setError('Credenciais inválidas');
        else {
          const body = await res.json().catch(() => ({}));
          setError(body.message || `Erro: status ${res.status}`);
        }
        return;
      }

      const body = await res.json().catch(() => ({}));
      if (body.token) saveToken(body.token);
      if (body.user) saveUser(body.user);

      // Redireciona para a área do portal da instituição (criar demanda)
      if (body.user && body.user.tipo === 'INSTITUICAO') {
        navigate('/portal/demandas/novo');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Erro de rede');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold">Portal da Instituição</h2>
            <p className="mt-2 text-sm text-gray-600">Gerencie suas necessidades e publique demandas.</p>

            <div className="mt-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setMode('login')}
                  className={`px-3 py-1 rounded ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                  Entrar
                </button>
                <button
                  onClick={() => setMode('cadastro')}
                  className={`px-3 py-1 rounded ${mode === 'cadastro' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
                  Cadastrar
                </button>
              </div>

              {mode === 'login' && (
                <form className="mt-4 space-y-4" onSubmit={handleLogin}>
                  <Input id="email-inst" label="E-mail institucional" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input id="senha-inst" label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />

                  {error && <div className="text-red-600 text-sm">{error}</div>}

                  <div className="flex items-center justify-between">
                    <Button type="submit" disabled={loading} className="bg-blue-600 text-white">
                      {loading ? 'Entrando...' : 'Entrar no Portal'}
                    </Button>
                    <Link to="#" className="text-sm text-gray-600">Esqueceu sua senha?</Link>
                  </div>
                </form>
              )}

              {mode === 'cadastro' && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700">Para cadastrar sua instituição, use o formulário de cadastro.</p>
                  <Link to="/cadastro/instituicao">
                    <Button className="mt-3 bg-green-600 text-white">Ir para cadastro de Instituição</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:block bg-gray-50 p-4 rounded">
            <h3 className="font-semibold">Por que criar conta como instituição?</h3>
            <ul className="mt-2 text-sm list-disc list-inside text-gray-700">
              <li>Publicar demandas e necessidades</li>
              <li>Gerenciar doações recebidas</li>
              <li>Receber contatos de doadores interessados</li>
            </ul>
            <p className="mt-4 text-xs text-gray-500">Em breve teremos um perfil de instituição mais completo com histórico e métricas.</p>
          </div>
        </div>
      </main>
    </div>
  );
}