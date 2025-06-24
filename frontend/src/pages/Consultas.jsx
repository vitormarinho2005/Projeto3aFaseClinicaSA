import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Consultas() {
  const [pacientes, setPacientes] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [erro, setErro] = useState("");
  const [medicos, setMedicos] = useState([]);
  const [medicoId, setMedicoId] = useState("");

  useEffect(() => {
    listarPacientes();
    listarConsultas();
    listarMedicos();
  }, []);

  async function listarPacientes() {
    try {
      const res = await api.get("/pacientes");
      setPacientes(res.data);
    } catch (err) {
      console.error("Erro ao listar pacientes:", err);
      setErro("Erro ao listar pacientes");
    }
  }

  async function listarConsultas() {
    try {
      const res = await api.get("/consultas"); // com token
      setConsultas(res.data); // CORREÇÃO! setar state
    } catch (err) {
      console.error("Erro ao listar consultas:", err);
      setErro("Erro ao listar consultas");
    }
  }

  async function cadastrar(e) {
    e.preventDefault();
    if (!pacienteId || !dataHora || !medicoId) return;
  
    // dataHora vem no formato: "2025-07-15T15:00"
    const [data, horario] = dataHora.split("T"); // separa em ["2025-07-15", "15:00"]
  
    // opcional: ajustar horário para "15:00:00" (adicionar segundos)
    const horarioFormatado = horario.length === 5 ? horario + ":00" : horario;
  
    try {
      await api.post("/consultas", {
        pacienteId,
        data,
        horario: horarioFormatado,
        medicoId,
      });
      setPacienteId("");
      setMedicoId("");
      setDataHora("");
      listarConsultas();
    } catch (err) {
      console.error("Erro ao agendar consulta:", err);
      setErro("Erro ao agendar consulta");
    }
  }

  async function listarMedicos() {
    try {
      const res = await api.get("/medicos"); // já existe no backend
      setMedicos(res.data);
    } catch (err) {
      console.error("Erro ao listar médicos:", err);
      setErro("Erro ao listar médicos");
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Consultas</h2>

        {erro && <div className="text-red-500 mb-4">{erro}</div>}

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

          <select
            className="border p-2 rounded"
            value={medicoId}
            onChange={(e) => setMedicoId(e.target.value)}
          >
            <option value="">Selecione o médico</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>

          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
          />

          <button type="submit" className="bg-blue-600 text-white px-4 rounded">
            Agendar
          </button>
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
