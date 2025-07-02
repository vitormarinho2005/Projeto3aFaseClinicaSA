import { useState } from 'react';
import api from '../services/api';

export default function CadastroMedico() {
  const [usuarioId, setUsuarioId] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [crm, setCrm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/medicos', {
        usuario_id: usuarioId,
        especialidade,
        crm,
      });
      alert('Médico cadastrado com sucesso!');
      setUsuarioId('');
      setEspecialidade('');
      setCrm('');
    } catch (err) {
      alert('Erro ao cadastrar médico');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Cadastrar Médico</h1>
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
        <button type="submit" className="bg-blue-600 text-white p-2 w-full">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
