import Perfil from "../components/Perfil";
import { useState } from "react";

export default function PerfilAdmin() {
  const [notificacoes] = useState([
    "Backup do sistema realizado com sucesso",
    "Nova atualização disponível",
    "3 usuários aguardando aprovação",
  ]);

  const acoes = [
    { id: 1, nome: "Gerenciar Usuários", descricao: "Adicionar, editar ou remover usuários." },
    { id: 2, nome: "Configurações do Sistema", descricao: "Ajustar preferências e parâmetros." },
    { id: 3, nome: "Relatórios", descricao: "Visualizar relatórios administrativos." },
  ];

  return (
    <Perfil
      titulo="Perfil do Administrador"
      descricao="Área exclusiva para administradores gerenciarem o sistema."
    >
      <section className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-blue-700 mb-2">Usuários Ativos</h3>
            <p className="text-2xl font-bold">125</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-green-700 mb-2">Consultas Hoje</h3>
            <p className="text-2xl font-bold">34</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-yellow-700 mb-2">Alertas Pendentes</h3>
            <p className="text-2xl font-bold">5</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Ações Rápidas</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {acoes.map((acao) => (
              <li key={acao.id}>
                <strong>{acao.nome}:</strong> {acao.descricao}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Notificações Recentes</h3>
          <ul className="bg-gray-100 p-4 rounded max-h-40 overflow-auto space-y-2">
            {notificacoes.map((msg, i) => (
              <li key={i} className="text-gray-600 hover:text-gray-800 cursor-default">
                • {msg}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => alert("Logout executado")}
          className="mt-6 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Sair
        </button>
      </section>
    </Perfil>
  );
}
