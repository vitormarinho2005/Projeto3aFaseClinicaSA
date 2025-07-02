const pool = require('../models/db');
const bcrypt = require('bcrypt');

// Criar usuário
exports.createUsuario = async (req, res) => {
  const { nome, email, senha, papel } = req.body;
  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      'INSERT INTO consultorio.usuarios (nome, email, senha, papel) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, hashedSenha, papel]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Criar médico completo: cria usuário + médico dentro de transação
exports.createMedicoCompleto = async (req, res) => {
  const { nome, email, senha, especialidade, crm } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const hashedSenha = await bcrypt.hash(senha, 10);
    const usuarioResult = await client.query(
      'INSERT INTO consultorio.usuarios (nome, email, senha, papel) VALUES ($1, $2, $3, $4) RETURNING id',
      [nome, email, hashedSenha, 'medico']
    );
    const usuarioId = usuarioResult.rows[0].id;
    const medicoResult = await client.query(
      'INSERT INTO consultorio.medicos (usuario_id, especialidade, crm) VALUES ($1, $2, $3) RETURNING *',
      [usuarioId, especialidade, crm]
    );
    await client.query('COMMIT');
    res.status(201).json({ usuarioId, medico: medicoResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Criar paciente vinculado a usuário existente
exports.createPaciente = async (req, res) => {
  const { usuario_id, data_nascimento } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO consultorio.pacientes (usuario_id, data_nascimento) VALUES ($1, $2) RETURNING *',
      [usuario_id, data_nascimento]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
