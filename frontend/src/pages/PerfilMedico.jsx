import Perfil from "../components/Perfil.jsx";


export default function PerfilMedico() {
  // Dados de exemplo do médico
  const medico = {
    nome: "Carlos",
    crm: "12345",
    consultasHoje: 5,
    proximasConsultas: [
      { id: 1, paciente_nome: "João Silva", data_hora: "2025-07-30T10:00" },
      { id: 2, paciente_nome: "Maria Souza", data_hora: "2025-08-01T15:00" },
    ],
  };


  return (
    <Perfil
      titulo="Perfil do Médico"
      descricao={`Bem-vindo, Dr. ${medico.nome}! CRM: ${medico.crm}`}
    >
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-green-700">
          Estatísticas de Hoje
        </h3>
        <p className="text-gray-700">
          Consultas agendadas para hoje:{" "}
          <strong>{medico.consultasHoje}</strong>
        </p>
      </section>


      <section>
        <h3 className="text-xl font-semibold mb-3 text-blue-700">
          Próximas Consultas
        </h3>
        {medico.proximasConsultas.length === 0 ? (
          <p className="text-gray-600">Nenhuma consulta agendada.</p>
        ) : (
          <ul className="space-y-4">
            {medico.proximasConsultas.map(
              ({ id, paciente_nome, data_hora }) => (
                <li
                  key={id}
                  className="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm flex justify-between items-center hover:bg-blue-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {paciente_nome}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(data_hora).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </Perfil>
  );
}
