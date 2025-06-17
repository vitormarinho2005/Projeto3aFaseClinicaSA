import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Pacientes() {
  const [nome, setNome] = useState("");
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => { listar(); }, []);

  async function listar() {
    try {
      const res = await api.get("/pacientes");
      setPacientes(res.data);
    } catch (err) {
      console.error("Erro ao listar pacientes:", err);
    }
  }

  async function cadastrar(e) {
    e.preventDefault();
    if (!nome.trim()) return;
    try {
      await api.post("/pacientes", { nome });
      setNome("");
      listar();
    } catch (err) {
      console.error("Erro ao cadastrar paciente:", err);
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Pacientes</h2>

        <form onSubmit={cadastrar} className="flex gap-2 mb-4">
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Nome do paciente"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 rounded">Adicionar</button>
        </form>

        <ul className="bg-white p-4 rounded shadow">
          {pacientes.map((p) => (
            <li key={p.id} className="py-2 border-b">{p.nome}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
