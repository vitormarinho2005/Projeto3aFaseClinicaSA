import React, { useState, useEffect } from 'react';
import api from '../services/api';

const NovaConsultaModal = ({ isOpen, onClose, onCriado }) => {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get('/pacientes').then(res => setPacientes(res.data));
      api.get('/medicos').then(res => setMedicos(res.data));
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post('/consultas', {
      paciente_id: pacienteId,
      medico_id: medicoId,
      data,
      hora,
      status: 'pendente'
    })
      .then(() => {
        alert('Consulta criada!');
        onCriado();
        onClose();
      })
      .catch(err => alert('Erro ao criar consulta: ' + err.message));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Nova Consulta</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium">Paciente:</label>
            <select
              className="w-full border p-2 rounded"
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Médico:</label>
            <select
              className="w-full border p-2 rounded"
              value={medicoId}
              onChange={(e) => setMedicoId(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {medicos.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Data:</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Hora:</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Criar Consulta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaConsultaModal;
