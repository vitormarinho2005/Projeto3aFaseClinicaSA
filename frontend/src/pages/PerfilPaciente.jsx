import Perfil from "../components/Perfil";
import { useState } from "react";

export default function PerfilPaciente() {
  const [consultas] = useState([
    { id: 1, data: "2025-07-20", medico: "Dr. Silva", status: "Confirmada" },
    { id: 2, data: "2025-08-05", medico: "Dra. Souza", status: "Pendente" },
  ]);

  const mensagens = [
    "Lembrete: exame de sangue agendado para 22/07",
    "Resultado do último exame disponível no sistema",
  ];

  return (
    <Perfil
      titulo="Perfil do Paciente"
      descricao="Aqui você pode acompanhar suas consultas e dados médicos."
    >
      <section className="mt-8 space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Próximas Consultas</h3>
          {consultas.length > 0 ? (
            <ul className="space-y-3">
              {consultas.map(({ id, data, medico, status }) => (
                <li
                  key={id}
                  className="p-4 bg-blue-50 rounded shadow flex justify-between items-center hover:bg-blue-100 transition"
                >
                  <div>
                    <p className="font-semibold">{medico}</p>
                    <p className="text-sm text-gray-600">{data}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      status === "Confirmada"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Nenhuma consulta agendada.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Mensagens</h3>
          <ul className="bg-gray-100 p-4 rounded max-h-40 overflow-auto space-y-2 text-gray-700">
            {mensagens.map((msg, i) => (
              <li key={i}>• {msg}</li>
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
