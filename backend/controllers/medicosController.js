const pool = require('../models/db');

// Listar todos os médicos com dados do usuário
exports.listarMedicos = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT id, nome, crm, especialidade_id FROM consultorio.medicos ORDER BY nome');
    return res.json(resultado.rows);
  } catch (error) {
    console.error('Erro ao listar médicos:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar médicos' });
  }
};

// Buscar médico por id
exports.buscarMedico = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query(`
      SELECT m.id, u.nome, u.email, m.especialidade, m.crm
      FROM consultorio.medicos m
      JOIN consultorio.usuarios u ON m.usuario_id = u.id
      WHERE m.id = $1
    `, [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Médico não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Criar novo médico
exports.criarMedico = async (req, res) => {
  const { usuario_id, especialidade, crm } = req.body;

  if (!usuario_id || !especialidade || !crm) {
    return res.status(400).json({ error: "Campos obrigatórios: usuario_id, especialidade, crm" });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO consultorio.medicos (usuario_id, especialidade, crm)
       VALUES ($1, $2, $3) RETURNING *`,
      [usuario_id, especialidade, crm]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar médico
exports.atualizarMedico = async (req, res) => {
  const { id } = req.params;
  const { especialidade, crm } = req.body;

  if (!especialidade || !crm) {
    return res.status(400).json({ error: "Campos obrigatórios: especialidade, crm" });
  }

  try {
    const resultado = await pool.query(
      'UPDATE consultorio.medicos SET especialidade = $1, crm = $2 WHERE id = $3 RETURNING *',
      [especialidade, crm, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Médico não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar médico
exports.deletarMedico = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      'DELETE FROM consultorio.medicos WHERE id = $1 RETURNING *',
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Médico não encontrado" });
    }
    res.json({ message: "Médico deletado com sucesso", medico: resultado.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
