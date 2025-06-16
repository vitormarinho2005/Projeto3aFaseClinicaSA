import React, { useState, useEffect } from 'react';

const EditConsultaModal = ({ isOpen, onClose, consulta, onSalvar }) => {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (consulta) {
      setData(consulta.data?.split('T')[0] || '');
      setHora(consulta.hora || '');
      setStatus(consulta.status || '');
    }
  }, [consulta]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar({
      id: consulta.id,
      data,
      hora,
      status
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Consulta</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-3">
            <label className="block text-sm font-medium">Hora:</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="pendente">Pendente</option>
              <option value="confirmada">Confirmada</option>
              <option value="realizada">Realizada</option>
              <option value="cancelada">Cancelada</option>
            </select>
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
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditConsultaModal;
