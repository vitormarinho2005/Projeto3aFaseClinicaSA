import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PerfilUsuario() {
  const navigate = useNavigate();

  // Exemplo de dados extras para o usuário comum
  const [atividadesRecentes] = useState([
    "Atualizou seu perfil",
    "Agendou uma consulta para 25/07",
    "Enviou uma mensagem para o suporte",
  ]);

  const [estatisticas] = useState({
    consultasMarcadas: 2,
    mensagensNaoLidas: 3,
  });

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-8 mt-12 bg-white rounded-md shadow-md">
        <nav className="mb-6 text-sm text-gray-500">
          <button
            onClick={() => navigate(-1)}
            className="mr-2 underline hover:text-gray-700"
          >
            Voltar
          </button>
          <span> &gt; Perfil do Usuário</span>
        </nav>

        <h1 className="text-3xl font-semibold mb-6 text-gray-900">Perfil do Usuário</h1>
        <p className="text-lg text-gray-700 mb-8">
          Bem-vindo, usuário comum! Aqui você pode acessar suas informações.
        </p>

        <section className="mb-8">
          <button
            onClick={() => alert("Função editar perfil em breve!")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Editar Perfil
          </button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-3 text-green-700">Estatísticas</h3>
            <p>Consultas Marcadas: <strong>{estatisticas.consultasMarcadas}</strong></p>
            <p>Mensagens Não Lidas: <strong>{estatisticas.mensagensNaoLidas}</strong></p>
          </div>

          <div className="bg-blue-50 p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">Atividades Recentes</h3>
            <ul className="list-disc list-inside text-gray-700">
              {atividadesRecentes.map((atividade, i) => (
                <li key={i}>{atividade}</li>
              ))}
            </ul>
          </div>
        </section>

        <button
          onClick={() => alert("Logout executado")}
          className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Sair
        </button>
      </main>
    </>
  );
}
