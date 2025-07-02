import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../contexts/UserContext";

function CampoInfo({ label, valor }) {
  return (
    <p>
      <strong>{label}:</strong> {valor}
    </p>
  );
}

export default function InformacoesUsuario() {
  const navigate = useNavigate();
  const { usuario } = useContext(UserContext);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-8 mt-12 bg-white rounded-md shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 underline text-gray-600 hover:text-gray-900"
        >
          &lt; Voltar
        </button>

        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          Informações do Usuário
        </h1>

        <div className="space-y-4 text-gray-700 max-w-md">
          <CampoInfo label="Nome" valor={usuario.nome} />
          <CampoInfo label="Email" valor={usuario.email} />
          <CampoInfo label="Telefone" valor={usuario.telefone} />
          <CampoInfo label="Endereço" valor={usuario.endereco} />
        </div>
      </main>
    </>
  );
}
