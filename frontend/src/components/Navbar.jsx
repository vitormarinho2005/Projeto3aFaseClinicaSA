import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex flex-wrap gap-4 justify-center md:justify-start">
      <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      <Link to="/pacientes" className="hover:underline">Pacientes</Link>
      <Link to="/consultas" className="hover:underline">Consultas</Link>
      <Link to="/uploads" className="hover:underline">Uploads</Link>
      <Link to="/perfil/usuario" className="hover:underline">Perfil do Usuário</Link>
      <Link to="/perfil/admin" className="hover:underline">Perfil do Admin</Link>
      <Link to="/perfil/paciente" className="hover:underline">Perfil do Paciente</Link>
      <Link to="/" className="ml-auto hover:underline">Sair</Link>
    </nav>
  );
}