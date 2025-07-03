const pool = require('../models/db');
const bcrypt = require('bcrypt');

// ================= USUÁRIOS ================== //

// Criar usuário genérico
exports.criarUsuario = async (req, res) => {
  const { nome, email, senha, papel } = req.body;

  if (!nome || !email || !senha || !papel) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO consultorio.usuarios (nome, email, senha, papel)
       VALUES ($1, $2, $3, $4) RETURNING id, nome, email, papel`,
      [nome, email, hashedSenha, papel]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ error: 'Erro interno ao criar usuário' });
  }
};

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nome, email, papel FROM consultorio.usuarios ORDER BY nome`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.status(500).json({ error: 'Erro interno ao listar usuários' });
  }
};

// Buscar usuário por ID
exports.buscarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, nome, email, papel FROM consultorio.usuarios WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ error: 'Erro interno ao buscar usuário' });
  }
};

// Atualizar usuário por ID
exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, papel } = req.body;

  try {
    const hashedSenha = senha ? await bcrypt.hash(senha, 10) : null;

    const result = await pool.query(
      `UPDATE consultorio.usuarios
       SET nome = $1, email = $2, senha = COALESCE($3, senha), papel = $4
       WHERE id = $5 RETURNING id, nome, email, papel`,
      [nome, email, hashedSenha, papel, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).json({ error: 'Erro interno ao atualizar usuário' });
  }
};

// Deletar usuário por ID
exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM consultorio.usuarios WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    res.status(500).json({ error: 'Erro interno ao deletar usuário' });
  }
};

// ================= MÉDICOS ================== //
exports.criarMedico = async (req, res) => {
  const { usuario_id, especialidade, crm } = req.body;

  if (!usuario_id || !especialidade || !crm) {
    return res.status(400).json({ error: 'Usuário, especialidade e CRM são obrigatórios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO consultorio.medicos (usuario_id, especialidade, crm)
       VALUES ($1, $2, $3) RETURNING *`,
      [usuario_id, especialidade, crm]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar médico:', err);
    res.status(500).json({ error: 'Erro interno ao criar médico' });
  }
};

exports.criarMedicoCompleto = async (req, res) => {
  const { nome, email, senha, especialidade, crm } = req.body;

  if (!nome || !email || !senha || !especialidade || !crm) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const hashedSenha = await bcrypt.hash(senha, 10);

    const usuarioResult = await client.query(
      `INSERT INTO consultorio.usuarios (nome, email, senha, papel)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [nome, email, hashedSenha, 'medico']
    );

    const usuarioId = usuarioResult.rows[0].id;

    const medicoResult = await client.query(
      `INSERT INTO consultorio.medicos (usuario_id, especialidade, crm)
       VALUES ($1, $2, $3) RETURNING *`,
      [usuarioId, especialidade, crm]
    );

    await client.query('COMMIT');

    res.status(201).json({ usuarioId, medico: medicoResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar médico completo:', err);
    res.status(500).json({ error: 'Erro interno ao criar médico completo' });
  } finally {
    client.release();
  }
};

exports.listarMedicos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, u.nome, u.email, m.especialidade, m.crm
      FROM consultorio.medicos m
      JOIN consultorio.usuarios u ON m.usuario_id = u.id
      ORDER BY u.nome
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar médicos:', err);
    res.status(500).json({ error: 'Erro interno ao listar médicos' });
  }
};

// ================= PACIENTES ================== //
exports.criarPaciente = async (req, res) => {
  const { usuario_id, data_nascimento } = req.body;

  if (!usuario_id || !data_nascimento) {
    return res.status(400).json({ error: 'Usuário e data de nascimento são obrigatórios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO consultorio.pacientes (usuario_id, data_nascimento)
       VALUES ($1, $2) RETURNING *`,
      [usuario_id, data_nascimento]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar paciente:', err);
    res.status(500).json({ error: 'Erro interno ao criar paciente' });
  }
};

exports.listarPacientes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, u.nome, u.email, p.data_nascimento
      FROM consultorio.pacientes p
      JOIN consultorio.usuarios u ON p.usuario_id = u.id
      ORDER BY u.nome
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar pacientes:', err);
    res.status(500).json({ error: 'Erro interno ao listar pacientes' });
  }
};
