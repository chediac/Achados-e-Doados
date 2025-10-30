// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { InstituicaoLoginPage } from './pages/InstituicaoLoginPage';

function App() {
  return (
    <Routes>
      {/* Rota 1: Página Inicial (URL: "/") */}
      <Route path="/" element={<HomePage />} />
      
      {/* Rota 2: Login do Doador (URL: "/login") */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rota 3: Login da Instituição (URL: "/instituicao/login") */}
      <Route path="/instituicao/login" element={<InstituicaoLoginPage />} />

      {/* TODO: Adicionar rotas de cadastro, resultados da busca, etc. */}
    </Routes>
  );
}

export default App;