import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EditConsultaModal from './EditConsultaModal';
import NovaConsultaModal from './NovaConsultaModal';

import jsPDF from "jspdf";
import "jspdf-autotable";

const exportarPDF = () => {
    const doc = new jsPDF();

    const colunas = ["Paciente", "Médico", "Data", "Hora", "Status"];
    const linhas = consultas.map((c) => [
        c.paciente_nome,
        c.medico_nome,
        c.data,
        c.hora,
        c.status
    ]);

    doc.text("Relatório de Consultas", 14, 10);
    doc.autoTable({
        head: [colunas],
        body: linhas,
        startY: 20
    });

    doc.save("consultas.pdf");
};

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportarExcel = () => {
  const dados = consultas.map((c) => ({
    Paciente: c.paciente_nome,
    Médico: c.medico_nome,
    Data: c.data,
    Hora: c.hora,
    Status: c.status,
  }));

  const planilha = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, planilha, "Consultas");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const arquivo = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(arquivo, "consultas.xlsx");
};

export default function ConsultasList({ dataInicio, dataFim }) {
    const [filtros, setFiltros] = useState({
        paciente: '',
        medico: '',
        status: '',
        data: ''
    });
    const [consultas, setConsultas] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [carregando, setCarregando] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [consultaSelecionada, setConsultaSelecionada] = useState(null);
    const [mostrarNovoModal, setMostrarNovoModal] = useState(false);

    useEffect(() => {
        const buscarConsultas = async () => {
            try {
                const query = new URLSearchParams(filtros).toString();
                const res = await api.get(`/consultas?${query}`);
                setConsultas(res.data);
            } catch (err) {
                alert('Erro ao buscar consultas');
            }
        };

        buscarConsultas();
    }, [filtros]);

    const handleAnterior = () => {
        if (pagina > 1) setPagina(pagina - 1);
    };

    const handleProximo = () => {
        if (pagina < totalPaginas) setPagina(pagina + 1);
    };

    const handleEditar = (consulta) => {
        setConsultaSelecionada(consulta);
        setMostrarModal(true);
    };

    const handleCancelar = (id) => {
        if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) return;

        api.patch(`/consultas/${id}/cancelar`)
            .then(() => {
                alert('Consulta cancelada!');
                setPagina(1);
            })
            .catch(err => alert('Erro ao cancelar: ' + err.message));
    };

    const handleSalvarEdicao = (dadosAtualizados) => {
        api.patch(`/consultas/${dadosAtualizados.id}`, {
            data: dadosAtualizados.data,
            hora: dadosAtualizados.hora,
            status: dadosAtualizados.status
        })
            .then(() => {
                alert('Consulta atualizada com sucesso!');
                setMostrarModal(false);
                setConsultaSelecionada(null);
                setPagina(1);
            })
            .catch(err => alert('Erro ao atualizar consulta: ' + err.message));
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Listagem de Consultas</h2>
            <div className="flex justify-end mb-3">
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => setMostrarNovoModal(true)}
                >
                    Nova Consulta
                </button>
                <NovaConsultaModal
                    isOpen={mostrarNovoModal}
                    onClose={() => setMostrarNovoModal(false)}
                    onCriado={() => setPagina(1)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Paciente"
                    className="border p-2 rounded"
                    value={filtros.paciente}
                    onChange={(e) => setFiltros({ ...filtros, paciente: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Médico"
                    className="border p-2 rounded"
                    value={filtros.medico}
                    onChange={(e) => setFiltros({ ...filtros, medico: e.target.value })}
                />
                <select
                    className="border p-2 rounded"
                    value={filtros.status}
                    onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                >
                    <option value="">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="realizada">Realizada</option>
                    <option value="cancelada">Cancelada</option>
                </select>
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={filtros.data}
                    onChange={(e) => setFiltros({ ...filtros, data: e.target.value })}
                />
            </div>
            <div className="flex gap-4 mb-4">
                <button onClick={exportarPDF} className="bg-red-500 text-white px-4 py-2 rounded">Exportar PDF</button>
                <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded">Exportar Excel</button>
            </div>
            {carregando ? (
                <p>Carregando...</p>
            ) : consultas.length === 0 ? (
                <p>Nenhuma consulta encontrada para o período selecionado.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-3 py-1">Data</th>
                            <th className="border border-gray-300 px-3 py-1">Hora</th>
                            <th className="border border-gray-300 px-3 py-1">Paciente</th>
                            <th className="border border-gray-300 px-3 py-1">Médico</th>
                            <th className="border border-gray-300 px-3 py-1">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consultas.map(c => (
                            <tr key={c.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 px-3 py-1">{new Date(c.data).toLocaleDateString()}</td>
                                <td className="border border-gray-300 px-3 py-1">{c.hora}</td>
                                <td className="border border-gray-300 px-3 py-1">{c.paciente}</td>
                                <td className="border border-gray-300 px-3 py-1">{c.medico}</td>
                                <td className="border border-gray-300 px-3 py-1 capitalize">{c.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="mt-4 flex justify-between">
                <button
                    onClick={handleAnterior}
                    disabled={pagina <= 1}
                    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span> Página {pagina} de {totalPaginas} </span>
                <button
                    onClick={handleProximo}
                    disabled={pagina >= totalPaginas}
                    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                    Próximo
                </button>
                <td className="border border-gray-300 px-3 py-1 text-sm text-center">
                    <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                        onClick={() => handleEditar(c)}
                    >
                        Editar
                    </button>
                    <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleCancelar(c.id)}
                    >
                        Cancelar
                    </button>
                </td>
            </div>
            <EditConsultaModal
                isOpen={mostrarModal}
                onClose={() => setMostrarModal(false)}
                consulta={consultaSelecionada}
                onSalvar={handleSalvarEdicao}
            />
        </div>
    );
}
