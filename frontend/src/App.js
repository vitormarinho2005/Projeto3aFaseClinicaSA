import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Consultas from "./pages/Consultas";
import Uploads from "./pages/Uploads";
import ProtectedRoute from "./components/ProtectedRoute";
import Cadastro from "./pages/Cadastro";
import Principal from './components/Principal';
import { AuthProvider } from "./contexts/AuthContext";
import EditarPerfil from "./pages/EditarPerfil";
import InformacoesUsuario from "./pages/InformacoesUsuario";
import Perfil from "./pages/Perfil";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/principal" element={<Principal />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/pacientes"
            element={<ProtectedRoute><Pacientes /></ProtectedRoute>}
          />
          <Route
            path="/consultas"
            element={<ProtectedRoute><Consultas /></ProtectedRoute>}
          />
          <Route
            path="/uploads"
            element={<ProtectedRoute><Uploads /></ProtectedRoute>}
          />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
          <Route path="/informacoes-usuario" element={<InformacoesUsuario />} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="*" element={<div className="p-8 text-center text-red-600">Página não encontrada</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
