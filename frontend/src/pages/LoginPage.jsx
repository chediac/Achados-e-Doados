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
    // Layout principal: flex-col para o footer ficar no fim
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      {/* Conteúdo principal: centralizado */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          
          <div className="text-center">
            {/* Títulos baseados no wireframe */}
            <h2 className="text-2xl font-bold text-gray-900">
              Bem-vindo de volta!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Entre na sua conta para continuar ajudando
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            
            <Input
              id="email"
              type="email"
              label="E-mail"
              placeholder="matheus@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              id="senha"
              type="password"
              label="Senha"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 text-white font-bold hover:bg-yellow-600 focus:ring-yellow-500"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
          {error && (
            <div className="mt-4 text-center text-sm text-red-600" role="alert">
              {error}
            </div>
          )}
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/cadastro/doador" className="font-medium text-blue-600 hover:text-blue-500 mr-2">
              Cadastre-se como Doador
            </Link>
            ou{' '}
            <Link to="/cadastro/instituicao" className="font-medium text-green-600 hover:text-green-500 ml-2">
              Cadastre-se como Instituição
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}