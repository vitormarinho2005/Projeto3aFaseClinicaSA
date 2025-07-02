import { useEffect, useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function Dashboard() {
  const [agendamentosPorEspecialidade, setAgendamentosPorEspecialidade] = useState(null);
  const [agendamentosPorDiaMes, setAgendamentosPorDiaMes] = useState(null);
  const [estatisticas, setEstatisticas] = useState({});
  const [erro, setErro] = useState("");

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Requisição: Agendamentos por especialidade/mês
  async function fetchAgendamentosPorEspecialidade() {
    const res = await api.get("/dashboard/agendamentos-especialidade-mes");
    const labels = res.data.map((item) => item.especialidade);
    const data = res.data.map((item) => parseInt(item.total));
    return {
      labels,
      datasets: [
        {
          label: "Agendamentos por Especialidade (Mês)",
          data,
          backgroundColor: "rgba(255, 159, 64, 0.6)",
        },
      ],
    };
  }

  // Requisição: Agendamentos por dia do mês
  async function fetchAgendamentosPorDiaMes() {
    const res = await api.get("/dashboard/agendamentos-dia-mes");
    const labels = res.data.map((item) => item.dia.toString());
    const data = res.data.map((item) => parseInt(item.total));
    return {
      labels,
      datasets: [
        {
          label: "Agendamentos por Dia do Mês",
          data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    };
  }

  // Requisição: Estatísticas gerais
  async function fetchEstatisticas() {
    const res = await api.get("/dashboard/estatisticas-gerais");
    return res.data;
  }

  // useEffect para carregar o dashboard
  useEffect(() => {
    async function fetchDashboard() {
      try {
        setErro("");
        const [porEspecialidade, porDiaMes, stats] = await Promise.all([
          fetchAgendamentosPorEspecialidade(),
          fetchAgendamentosPorDiaMes(),
          fetchEstatisticas(),
        ]);

        setAgendamentosPorEspecialidade(porEspecialidade);
        setAgendamentosPorDiaMes(porDiaMes);
        setEstatisticas(stats);
      } catch (error) {
        console.error("Erro no Dashboard:", error);
        if (error.response?.status === 401) {
          logout();
          navigate("/login");
        } else if (error.response?.status === 403) {
          setErro("Acesso negado: você não tem permissão para acessar esse recurso.");
        } else {
          setErro("Erro ao carregar o Dashboard.");
        }
      }
    }

    fetchDashboard();
  }, [logout, navigate]);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

        {erro && (
          <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{erro}</div>
        )}

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Agendamentos Hoje</h3>
            <p className="text-3xl">{estatisticas.consultasHoje ?? "-"}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Pacientes Ativos</h3>
            <p className="text-3xl">{estatisticas.pacientesAtivos ?? "-"}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Novos Pacientes (Mês)</h3>
            <p className="text-3xl">{estatisticas.novosCadastros ?? "-"}</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Agendamentos por Especialidade (Mês)</h3>
            {agendamentosPorEspecialidade ? (
              <Bar data={agendamentosPorEspecialidade} />
            ) : (
              <p>Carregando gráfico...</p>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Agendamentos por Dia do Mês</h3>
            {agendamentosPorDiaMes ? (
              <Bar data={agendamentosPorDiaMes} />
            ) : (
              <p>Carregando gráfico...</p>
            )}
          </div>
        </div>

        {/* Últimas consultas */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Últimas Consultas Realizadas</h3>
          {estatisticas.ultimasConsultas?.length > 0 ? (
            <ul className="divide-y">
              {estatisticas.ultimasConsultas.map((consulta) => (
                <li key={consulta.id} className="py-2">
                  <p className="font-semibold">{consulta.pacienteNome}</p>
                  <p>
                    Médico: {consulta.medicoNome} -{" "}
                    {new Date(consulta.data).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Sem dados disponíveis.</p>
          )}
        </div>

        {/* Últimos pacientes */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Últimos Pacientes Cadastrados</h3>
          {estatisticas.ultimosPacientes?.length > 0 ? (
            <ul className="divide-y">
              {estatisticas.ultimosPacientes.map((paciente) => (
                <li key={paciente.id} className="py-2">
                  <p className="font-semibold">{paciente.nome}</p>
                  <p>Email: {paciente.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Sem dados disponíveis.</p>
          )}
        </div>
      </div>
    </>
  );
}
