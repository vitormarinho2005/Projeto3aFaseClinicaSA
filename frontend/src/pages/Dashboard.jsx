import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../../services/api";
import "./Dashboard.css";

const cores = ["#8884d8", "#82ca9d", "#FF8042", "#FFBB28", "#0088FE"];

function Dashboard() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      const res = await api.get("/dashboard");
      setDados(res.data);
    };
    buscarDados();
  }, []);

  if (!dados) return <p>Carregando gráficos...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard de Consultas</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Gráfico de Barras - Consultas por Mês */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Consultas por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.porMes}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras - Consultas por Médico */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Consultas por Médico</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.porMedico}>
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Status */}
        <div className="bg-white p-4 shadow rounded md:col-span-2">
          <h3 className="font-semibold mb-2">Distribuição de Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dados.porStatus}
                dataKey="total"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {dados.porStatus.map((_, i) => (
                  <Cell key={i} fill={cores[i % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
