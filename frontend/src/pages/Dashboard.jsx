import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import Navbar from "../components/Navbar";
import api from "../services/api";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function Dashboard() {
  const [dados, setDados] = useState({});
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) {
        setErro("Usuário não autenticado.");
        return;
      }

      try {
        // Agora chamando a rota correta
        const res = await api.get("/dashboard/dashboard");

        setDados({
          labels: res.data.map((item) => item.mes),
          datasets: [{
            label: "Consultas por mês",
            data: res.data.map((item) => item.total),
            backgroundColor: "#3B82F6",
          }],
        });
      } catch (error) {
        setErro(error.response?.data?.erro || "Erro ao carregar dados");
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

        {erro && (
          <div className="bg-red-200 text-red-800 p-3 rounded mb-4">
            {erro}
          </div>
        )}

        <div className="bg-white p-4 rounded shadow w-full md:w-2/3">
          {dados.labels ? <Bar data={dados} /> : <p>Carregando gráfico...</p>}
        </div>
      </div>
    </>
  );
}
