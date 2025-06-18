import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Uploads() {
  const [arquivo, setArquivo] = useState(null);
  const [pacienteId, setPacienteId] = useState("");
  const [arquivos, setArquivos] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    listarPacientes();
    listarArquivos();
  }, []);

  async function listarPacientes() {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPacientes(res.data);
    } catch (error) {
      console.error("Erro ao listar pacientes:", error);
    }
  }

  async function listarArquivos() {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/arquivos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArquivos(res.data);
    } catch (error) {
      console.error("Erro ao listar arquivos:", error);
    }
  }

  async function enviar(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!arquivo || !pacienteId) {
      alert("Selecione um arquivo e um paciente");
      return;
    }

    const formData = new FormData();
    formData.append("arquivo", arquivo);
    formData.append("paciente_id", pacienteId);

    try {
      await api.post("/arquivos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setArquivo(null);
      listarArquivos();
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Uploads</h2>

        <form onSubmit={enviar} className="flex flex-col md:flex-row gap-2 mb-4">
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
            type="file"
            className="border p-2 rounded"
            onChange={(e) => setArquivo(e.target.files[0])}
          />
          <button className="bg-blue-600 text-white px-4 rounded">Enviar</button>
        </form>

        <ul className="bg-white p-4 rounded shadow">
          {arquivos.map((a) => (
            <li key={a.id} className="py-2 border-b">
              <a
                className="text-blue-600 underline"
                href={`http://localhost:3000/${a.caminho}`}
                target="_blank"
                rel="noreferrer"
              >
                {a.nome}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
