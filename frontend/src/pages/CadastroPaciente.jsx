import { useState } from 'react';
import api from '../services/api';

export default function CadastroPaciente() {
  const [usuarioId, setUsuarioId] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/pacientes', {
        usuario_id: usuarioId,
        data_nascimento: dataNascimento,
      });
      alert('Paciente cadastrado com sucesso!');
      setUsuarioId('');
      setDataNascimento('');
    } catch (err) {
      alert('Erro ao cadastrar paciente');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Cadastrar Paciente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="ID do Usuário"
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="date"
          placeholder="Data de Nascimento"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-green-600 text-white p-2 w-full">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
