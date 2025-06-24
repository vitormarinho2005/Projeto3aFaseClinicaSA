import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Pacientes() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");  // novo estado para email
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    listar();
  }, []);

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

    if (!nome.trim() || !email.trim()) {
      // Se nome ou email vazios, não envia
      alert("Preencha nome e email!");
      return;
    }

    try {
      await api.post("/pacientes", { nome, email });
      setNome("");
      setEmail("");
      listar();
    } catch (err) {
      console.error("Erro ao cadastrar paciente:", err);
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Pacientes</h2>

        <form onSubmit={cadastrar} className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Nome do paciente"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="email"
            className="border p-2 rounded w-full"
            placeholder="Email do paciente"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
          >
            Adicionar
          </button>
        </form>

        <ul className="bg-white p-4 rounded shadow max-h-96 overflow-auto">
          {pacientes.length > 0 ? (
            pacientes.map((p) => (
              <li key={p.id} className="py-2 border-b last:border-b-0">
                {p.nome} - {p.email}
              </li>
            ))
          ) : (
            <li className="text-gray-500">Nenhum paciente cadastrado.</li>
          )}
        </ul>
      </div>
    </>
  );
}
