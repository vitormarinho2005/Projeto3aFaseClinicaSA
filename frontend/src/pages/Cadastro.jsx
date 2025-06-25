import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [papel, setPapel] = useState('paciente'); // valor inicial válido
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples de preenchimento
    if (!nome.trim() || !email.trim() || !senha || !papel) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setCarregando(true);

    try {
      // Log para debug
      console.log('Enviando dados:', { nome, email, senha, papel });

      // Chamada à API para cadastro
      await api.post('/users/usuarios', {
        nome: nome.trim(),
        email: email.trim(),
        senha,
        papel,
      });

      alert('Usuário cadastrado com sucesso!');
      navigate('/'); // redireciona para a página de login
    } catch (error) {
      console.error('Erro ao cadastrar:', error);

      // Verifica se a resposta tem uma mensagem de erro específica
      if (error.response?.data?.error) {
        alert(`Erro: ${error.response.data.error}`);
      } else {
        alert('Erro ao cadastrar usuário. Tente novamente mais tarde.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Cadastro</h1>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="border p-2 w-full rounded"
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 w-full rounded"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="border p-2 w-full rounded"
          autoComplete="new-password"
        />
        <select
          value={papel}
          onChange={(e) => setPapel(e.target.value)}
          required
          className="border p-2 w-full rounded"
        >
          <option value="">Selecione o papel</option>
          <option value="paciente">Paciente</option>
          <option value="medico">Médico</option>
          <option value="admin">Administrador</option>
        </select>
        <button
          type="submit"
          disabled={carregando}
          className={`p-2 w-full rounded text-white ${
            carregando ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors duration-200`}
        >
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}
