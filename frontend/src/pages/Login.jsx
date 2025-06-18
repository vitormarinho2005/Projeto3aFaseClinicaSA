<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // ajuste o caminho conforme seu projeto
=======
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext"; // importa o contexto
>>>>>>> 309f41a (Quarto commit)

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
<<<<<<< HEAD
=======
  const { login } = useContext(AuthContext); // pega a função login()
>>>>>>> 309f41a (Quarto commit)

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");
<<<<<<< HEAD
  
    try {
      const res = await api.post('/auth/login', { email, senha });
    
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        console.log('Token salvo no localStorage:', res.data.token);
        navigate("/dashboard"); // <-- aqui redireciona após login
      }    
=======

    try {
      const res = await api.post("/auth/login", { email, senha });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        console.log("Token recebido:", res.data.token);

        // chama login() do contexto (salva token e usuario)
        login(res.data.token, res.data.usuario);

        // redireciona
        navigate("/dashboard");
      }
>>>>>>> 309f41a (Quarto commit)
    } catch (error) {
      if (error.response && error.response.data) {
        setErro(error.response.data.erro || "Erro ao fazer login");
      } else {
        setErro("Erro na conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }  
=======
  }
>>>>>>> 309f41a (Quarto commit)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {erro && (
          <div className="bg-red-200 text-red-800 p-3 mb-4 rounded">{erro}</div>
        )}

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />

        <label className="block mb-2 font-semibold">Senha</label>
        <input
          type="password"
          className="w-full p-2 mb-6 border rounded"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
