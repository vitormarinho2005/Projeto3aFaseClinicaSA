import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Consultas() {
  const [pacientes, setPacientes] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [dataHora, setDataHora] = useState("");

  useEffect(() => {
    listarPacientes();
    listarConsultas();
  }, []);

  async function listarPacientes() {
    const res = await api.get("/pacientes");
    setPacientes(res.data);
  }

  async function listarConsultas() {
    const res = await api.get("/consultas");
    setConsultas(res.data);
  }

  async function cadastrar(e) {
    e.preventDefault();
    if (!pacienteId || !dataHora) return;
    await api.post("/consultas", {
      paciente_id: pacienteId,
      data: dataHora,
    });
    setPacienteId("");
    setDataHora("");
    listarConsultas();
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Consultas</h2>

        <form onSubmit={cadastrar} className="flex flex-col md:flex-row gap-2 mb-4">
          <select
            className="border p-2 rounded"
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
          >
            <option value="">Selecione o paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 rounded">Agendar</button>
        </form>

        <ul className="bg-white p-4 rounded shadow">
          {consultas.map((c) => (
            <li key={c.id} className="py-2 border-b">
              {c.nome_paciente} – {new Date(c.data).toLocaleString("pt-BR")}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
