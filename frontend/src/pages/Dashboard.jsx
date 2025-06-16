import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import Navbar from "../components/Navbar";
import api from "../services/api";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function Dashboard() {
  const [dados, setDados] = useState({});

  useEffect(() => {
    async function fetchData() {
      const res = await api.get("/consultas/estatisticas");
      setDados({
        labels: res.data.map((item) => item.mes),
        datasets: [{
          label: "Consultas por mês",
          data: res.data.map((item) => item.total),
          backgroundColor: "#3B82F6"
        }]
      });
    }
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <div className="bg-white p-4 rounded shadow w-full md:w-2/3">
          {dados.labels ? <Bar data={dados} /> : <p>Carregando gráfico...</p>}
        </div>
      </div>
    </>
  );
}
