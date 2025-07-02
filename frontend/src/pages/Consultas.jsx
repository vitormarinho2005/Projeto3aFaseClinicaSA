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
      if (Array.isArray(res.data)) {
        setPacientes(res.data);
      } else {
        setPacientes([]);
        setErro("Formato de dados inválido ao listar pacientes");
      }
    } catch (err) {
      console.error("Erro ao listar pacientes:", err);
      setErro("Erro ao listar pacientes");
    }
  }

  async function listarConsultas() {
    try {
      const res = await api.get("/consultas");
      // Garante que consultas seja array antes de setar
      if (Array.isArray(res.data)) {
        setConsultas(res.data);
      } else if (Array.isArray(res.data.consultas)) {
        setConsultas(res.data.consultas);
      } else {
        setConsultas([]);
        setErro("Formato de dados inválido ao listar consultas");
      }
    } catch (err) {
      console.error("Erro ao listar consultas:", err);
      setErro("Erro ao listar consultas");
    }
  }

  async function listarMedicos() {
    try {
      const res = await api.get("/medicos");
      if (Array.isArray(res.data)) {
        setMedicos(res.data);
      } else {
        setMedicos([]);
        setErro("Formato de dados inválido ao listar médicos");
      }
    } catch (err) {
      console.error("Erro ao listar médicos:", err);
      setErro("Erro ao listar médicos");
    }
  }

  async function cadastrar(e) {
    e.preventDefault();
    setErro("");

    if (!pacienteId || !dataHora || !medicoId) {
      setErro("Por favor, preencha todos os campos para agendar a consulta.");
      return;
    }

    try {
      // dataHora esperado: "2025-07-15T15:00"
      const [data, horario] = dataHora.split("T");
      const horarioFormatado = horario.length === 5 ? horario + ":00" : horario;

      await api.post("/consultas", {
        pacienteId,
        data,
        horario: horarioFormatado,
        medicoId,
      });

      // Limpar campos e recarregar consultas
      setPacienteId("");
      setMedicoId("");
      setDataHora("");
      listarConsultas();
    } catch (err) {
      console.error("Erro ao agendar consulta:", err);
      setErro("Erro ao agendar consulta");
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
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={medicoId}
            onChange={(e) => setMedicoId(e.target.value)}
          >
            <option value="">Selecione o médico</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
          >
            Agendar
          </button>
        </form>

        <ul className="bg-white p-4 rounded shadow max-h-96 overflow-auto">
          {Array.isArray(consultas) && consultas.length > 0 ? (
            consultas.map((c) => (
              <li key={c.id} className="py-2 border-b">
                <strong>{c.nome_paciente ?? c.pacienteNome ?? "Paciente"}</strong> –{" "}
                {new Date(c.data).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </li>
            ))
          ) : (
            <p>Sem consultas disponíveis.</p>
          )}
        </ul>
      </div>
    </>
  );
}
