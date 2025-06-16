import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Uploads() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [arquivos, setArquivos] = useState([]);

  useEffect(() => {
    listarPacientes();
    listarArquivos();
  }, []);

  async function listarPacientes() {
    const res = await api.get("/pacientes");
    setPacientes(res.data);
  }

  async function listarArquivos() {
    const res = await api.get("/arquivos");
    setArquivos(res.data);
  }

  async function enviar(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    formData.append("paciente_id", pacienteId);
    await api.post("/arquivos", formData);
    setArquivo(null);
    listarArquivos();
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
