import { useEffect, useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function Dashboard() {
  const [consultasPorMedico, setConsultasPorMedico] = useState(null);
  const [consultasPorDiaSemana, setConsultasPorDiaSemana] = useState(null);
  const [estatisticas, setEstatisticas] = useState({});
  const [erro, setErro] = useState("");

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        // Consultas por médico no mês - labels e dados
        const resMedicos = await api.get("/dashboard/consultas-medicos-mes");
        const labelsMedicos = resMedicos.data.map((item) => item.nome);
        const dataMedicos = resMedicos.data.map((item) => parseInt(item.total));

        setConsultasPorMedico({
          labels: labelsMedicos,
          datasets: [
            {
              label: "Consultas por Médico (Mês)",
              data: dataMedicos,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });

        // Consultas por dia da semana - labels e dados
        const resDias = await api.get("/dashboard/consultas-dia-semana");
        const labelsDias = resDias.data.map((item) => item.dia_semana.trim());
        const dataDias = resDias.data.map((item) => parseInt(item.total_consultas));

        setConsultasPorDiaSemana({
          labels: labelsDias,
          datasets: [
            {
              label: "Consultas por Dia da Semana",
              data: dataDias,
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        });

        // Estatísticas gerais e listas
        const resStats = await api.get("/dashboard");
        setEstatisticas(resStats.data);
      } catch (error) {
        console.error("Erro no Dashboard:", error);
        if (error.response?.status === 401) {
          logout();
          navigate("/login");
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
          <div className="bg-red-200 text-red-800 p-3 rounded mb-4">
            {erro}
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Consultas Hoje</h3>
            <p className="text-3xl">{estatisticas.consultasHoje ?? "-"}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Pacientes Ativos</h3>
            <p className="text-3xl">{estatisticas.pacientesAtivos ?? "-"}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Novos Cadastros (Mês)</h3>
            <p className="text-3xl">{estatisticas.novosCadastros ?? "-"}</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Consultas por Médico (Mês)</h3>
            {consultasPorMedico ? (
              <Bar data={consultasPorMedico} />
            ) : (
              <p>Carregando gráfico...</p>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Consultas por Dia da Semana</h3>
            {consultasPorDiaSemana ? (
              <Bar data={consultasPorDiaSemana} />
            ) : (
              <p>Carregando gráfico...</p>
            )}
          </div>
        </div>

        {/* Últimas consultas */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Últimas Consultas</h3>
          <ul className="divide-y">
            {estatisticas.ultimasConsultas?.map((consulta) => (
              <li key={consulta.id} className="py-2">
                <p className="font-semibold">{consulta.pacienteNome}</p>
                <p>
                  Médico: {consulta.medicoNome} -{" "}
                  {new Date(consulta.data).toLocaleDateString()}
                </p>
              </li>
            )) || <p>Sem dados disponíveis.</p>}
          </ul>
        </div>

        {/* Últimos pacientes */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Últimos Pacientes</h3>
          <ul className="divide-y">
            {estatisticas.ultimosPacientes?.map((paciente) => (
              <li key={paciente.id} className="py-2">
                <p className="font-semibold">{paciente.nome}</p>
                <p>Email: {paciente.email}</p>
              </li>
            )) || <p>Sem dados disponíveis.</p>}
          </ul>
        </div>
      </div>
    </>
  );
}
