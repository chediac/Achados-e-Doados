// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { saveToken, saveUser } from '../lib/auth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !senha) {
      setError('Preencha e-mail e senha');
      return;
    }
    setLoading(true);
    try {
      console.log('Login submit', { email });
      // Tenta rota de login padrão
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.token) {
          saveToken(body.token);
        }
        if (body.user) {
          saveUser(body.user);
        }
        // redireciona para home
        navigate('/');
        return;
      }

      if (res.status === 404) {
        // servidor possivelmente não implementou /api/login
        setError('Endpoint de autenticação não disponível no backend (404).');
      } else if (res.status === 401) {
        setError('Credenciais inválidas');
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Card Principal */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header com Gradiente */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
              <div className="text-5xl mb-4">👋</div>
              <h2 className="text-3xl font-bold mb-2">
                Bem-vindo de volta!
              </h2>
              <p className="text-blue-100">
                Entre na sua conta para continuar ajudando
              </p>
            </div>

            {/* Formulário */}
            <div className="p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <Input
                  id="email"
                  type="email"
                  label="E-mail"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <Input
                  id="senha"
                  type="password"
                  label="Senha"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />

                <div className="flex items-center justify-end">
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Esqueceu sua senha?
                  </a>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3" role="alert">
                    <span className="text-xl">⚠️</span>
                    <p className="text-sm text-red-800 flex-1">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <span>🔓</span>
                      Entrar
                    </>
                  )}
                </button>
              </form>

              {/* Links de Cadastro */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 mb-4">
                  Não tem uma conta?
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <Link 
                    to="/cadastro/doador" 
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-all"
                  >
                    <span>❤️</span>
                    Cadastrar como Doador
                  </Link>
                  <Link 
                    to="/cadastro/instituicao" 
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 font-semibold rounded-lg border-2 border-green-200 hover:border-green-300 transition-all"
                  >
                    <span>🏢</span>
                    Cadastrar como Instituição
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Link para Login Institucional */}
          <div className="mt-6 text-center">
            <Link 
              to="/login/instituicao" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              <span>🏢</span>
              Acessar como Instituição
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}