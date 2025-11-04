// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { InstituicaoLoginPage } from './pages/InstituicaoLoginPage';
import { CadastroDoador } from './pages/CadastroDoador';
import { CadastroInstituicao } from './pages/CadastroInstituicao';
import { ProfilePage } from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import CriarDemanda from './pages/CriarDemanda';

function App() {
  return (
    <Routes>
      {/* Rota 1: Página Inicial (URL: "/") */}
      <Route path="/" element={<HomePage />} />
      
      {/* Rota 2: Login do Doador (URL: "/login") */}
      <Route path="/login" element={<LoginPage />} />

  {/* Área protegida: perfil do usuário */}
  <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

  {/* Rota: Cadastro do Doador */}
  <Route path="/cadastro/doador" element={<CadastroDoador />} />

    {/* Rota: Cadastro da Instituição */}
    <Route path="/cadastro/instituicao" element={<CadastroInstituicao />} />

      {/* Rota protegida: criar demanda (portal da instituição) */}
  <Route path="/portal/demandas/novo" element={<ProtectedRoute allowedTipo="INSTITUICAO"><CriarDemanda /></ProtectedRoute>} />

      {/* Rota 3: Login da Instituição (URL: "/instituicao/login") */}
      <Route path="/instituicao/login" element={<InstituicaoLoginPage />} />

      {/* TODO: Adicionar rotas de cadastro, resultados da busca, etc. */}
    </Routes>
  );
}

export default App;