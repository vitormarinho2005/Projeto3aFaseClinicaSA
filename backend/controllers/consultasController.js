// controllers/consultasController.js
const pool = require('../models/db');

exports.listarConsultas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id, 
        p.nome AS nome_paciente, 
        m.nome AS nome_medico, 
        c.data, 
        c.horario
      FROM consultorio.consultas c
      JOIN consultorio.pacientes p ON c.paciente_id = p.id
      JOIN consultorio.medicos m ON c.medico_id = m.id
      ORDER BY c.data DESC, c.horario DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar consultas:', err);
    res.status(500).json({ erro: 'Erro ao listar consultas' });
  }
};

exports.cadastrarConsulta = async (req, res) => {
  const { pacienteId, medicoId, data, horario } = req.body;

  if (!pacienteId || !medicoId || !data || !horario) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
  }

  try {
    await pool.query(
      `INSERT INTO consultorio.consultas (paciente_id, medico_id, data, horario)
       VALUES ($1, $2, $3, $4)`,
      [pacienteId, medicoId, data, horario]
    );
    res.status(201).json({ message: 'Consulta cadastrada com sucesso' });
  } catch (err) {
    console.error('Erro ao cadastrar consulta:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar consulta' });
  }
};
