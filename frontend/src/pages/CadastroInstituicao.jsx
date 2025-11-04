import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Input } from '../components/Input';
import Button from '../components/Button';

export function CadastroInstituicao() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!nome || !email || !senha) {
      setError('Nome, e-mail e senha são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/cadastro/instituicao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, telefone, endereco }),
      });

      if (res.status === 201) {
        navigate('/login');
        return;
      }

      const body = await res.json().catch(() => ({}));
      setError(body.message || `Erro: status ${res.status}`);
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
          <h2 className="text-2xl font-bold text-gray-900">Cadastro de Instituição</h2>
          <p className="mt-2 text-sm text-gray-600">Cadastre a sua instituição para publicar demandas.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Input id="nome" label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <Input id="email" type="email" label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input id="senha" type="password" label="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <Input id="telefone" label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            <Input id="endereco" label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div>
              <Button type="submit" className="bg-green-600 text-white">{loading ? 'Cadastrando...' : 'Cadastrar'}</Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CadastroInstituicao;
