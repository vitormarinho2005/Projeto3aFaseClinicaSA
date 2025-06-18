import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Arquivos() {
  const [arquivos, setArquivos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarArquivos();
  }, []);

  async function listarArquivos() {
    const token = localStorage.getItem("token");
    console.log("Token do localStorage:", token);
  
    try {
      const res = await api.get("/arquivos");
      console.log("Arquivos recebidos:", res.data);
    } catch (error) {
      console.error("Erro na requisição:", error.response?.status, error.response?.data);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Arquivos</h2>

      {erro && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{erro}</div>
      )}

      {arquivos.length === 0 && !erro ? (
        <p>Nenhum arquivo encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {arquivos.map((arq) => (
            <li key={arq.id} className="border p-4 rounded shadow">
              <strong>Nome:</strong> {arq.nome_arquivo} <br />
              <strong>Data:</strong> {new Date(arq.data_upload).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
