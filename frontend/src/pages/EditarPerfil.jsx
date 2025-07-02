import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../contexts/UserContext";

export default function EditarPerfil() {
  const navigate = useNavigate();
  const { usuario, atualizarUsuario } = useContext(UserContext);

  // Estados dos campos
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");

  // Estados para UX
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState("");

  // Inicializa os campos com dados atuais do usuário
  useEffect(() => {
    setNome(usuario.nome || "");
    setEmail(usuario.email || "");
    setTelefone(usuario.telefone || "");
    setEndereco(usuario.endereco || "");
  }, [usuario]);

  // Função simples para validar email
  function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // Função simples para validar telefone (apenas números e 8-15 dígitos)
  function validarTelefone(tel) {
    return /^\d{8,15}$/.test(tel.replace(/\D/g, ""));
  }

  function handleSalvar(e) {
    e.preventDefault();
    setError("");
    setSucesso("");

    // Limpar espaços em branco
    const nomeTrim = nome.trim();
    const emailTrim = email.trim();
    const telefoneTrim = telefone.trim();
    const enderecoTrim = endereco.trim();

    // Validações básicas
    if (!nomeTrim || !emailTrim) {
      setError("Nome e email são obrigatórios.");
      return;
    }

    if (!validarEmail(emailTrim)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    if (telefoneTrim && !validarTelefone(telefoneTrim)) {
      setError(
        "Telefone inválido. Use apenas números, entre 8 e 15 dígitos, sem espaços ou símbolos."
      );
      return;
    }

    setLoading(true);

    // Simula delay para salvar (ex: chamada API)
    setTimeout(() => {
      atualizarUsuario({
        nome: nomeTrim,
        email: emailTrim,
        telefone: telefoneTrim,
        endereco: enderecoTrim,
      });
      setLoading(false);
      setSucesso("Perfil atualizado com sucesso!");
      // Redirecionar depois de 1.5s
      setTimeout(() => navigate("/informacoes-usuario"), 1500);
    }, 1000);
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-8 mt-12 bg-white rounded-md shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 underline text-gray-600 hover:text-gray-900"
          disabled={loading}
        >
          &lt; Voltar
        </button>

        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          Editar Perfil do Usuário
        </h1>

        <form onSubmit={handleSalvar} className="space-y-6 max-w-md">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}
          {sucesso && (
            <div className="p-3 bg-green-100 text-green-700 rounded">{sucesso}</div>
          )}

          <div>
            <label className="block mb-2 font-medium text-gray-700">Nome *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Digite seu nome"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Digite seu email"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Somente números, ex: 11999999999"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Endereço</label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Digite seu endereço"
              disabled={loading}
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex-1"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition flex-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
