import { useState } from 'react';
import api from '../services/api';

export default function CadastroUsuarioCompleto() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('medico'); // 'medico' ou 'paciente'

  // dados específicos
  const [especialidade, setEspecialidade] = useState('');
  const [crm, setCrm] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Criar usuário
      const resUser = await api.post('/users/usuarios', { nome, email, senha });
      const usuarioId = resUser.data.id;

      if (tipo === 'medico') {
        // 2a. Criar médico
        await api.post('/users/medicos', {
          usuario_id: usuarioId,
          especialidade,
          crm,
        });
      } else {
        // 2b. Criar paciente
        await api.post('/users/pacientes', {
          usuario_id: usuarioId,
          data_nascimento: dataNascimento,
        });
      }

      alert('Cadastro realizado com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
      setEspecialidade('');
      setCrm('');
      setDataNascimento('');
      setTipo('medico');

    } catch (err) {
      alert('Erro ao cadastrar usuário');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Cadastro Completo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="border p-2 w-full"
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="medico">Médico</option>
          <option value="paciente">Paciente</option>
        </select>

        {tipo === 'medico' ? (
          <>
            <input
              type="text"
              placeholder="Especialidade"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              required
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="CRM"
              value={crm}
              onChange={(e) => setCrm(e.target.value)}
              required
              className="border p-2 w-full"
            />
          </>
        ) : (
          <input
            type="date"
            placeholder="Data de Nascimento"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
            className="border p-2 w-full"
          />
        )}

        <button type="submit" className="bg-blue-600 text-white p-2 w-full">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
