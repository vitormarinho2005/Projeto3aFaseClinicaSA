// userController.js
const pool = require('../models/db');
const bcrypt = require('bcrypt');

// Criar médico (precisa de usuário já cadastrado)
exports.createMedico = async (req, res) => {
  const { usuario_id, especialidade, crm } = req.body;

  if (!usuario_id || !especialidade || !crm) {
    return res.status(400).json({ error: 'usuario_id, especialidade e crm são obrigatórios.' });
  }

  try {
    // Verificar se usuário existe
    const usuarioExiste = await pool.query('SELECT id FROM consultorio.usuarios WHERE id = $1', [usuario_id]);
    if (usuarioExiste.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado para o usuario_id fornecido.' });
    }

    const result = await pool.query(
      'INSERT INTO consultorio.medicos (usuario_id, especialidade, crm) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, especialidade, crm]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar médico:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Listar médicos
exports.listMedicos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, u.nome, u.email, m.especialidade, m.crm
      FROM consultorio.medicos m
      JOIN consultorio.usuarios u ON m.usuario_id = u.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar médicos:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Criar paciente (precisa de usuário já cadastrado)
exports.createPaciente = async (req, res) => {
  const { usuario_id, data_nascimento } = req.body;

  if (!usuario_id || !data_nascimento) {
    return res.status(400).json({ error: 'usuario_id e data_nascimento são obrigatórios.' });
  }

  try {
    // Verificar se usuário existe
    const usuarioExiste = await pool.query('SELECT id FROM consultorio.usuarios WHERE id = $1', [usuario_id]);
    if (usuarioExiste.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado para o usuario_id fornecido.' });
    }

    const result = await pool.query(
      'INSERT INTO consultorio.pacientes (usuario_id, data_nascimento) VALUES ($1, $2) RETURNING *',
      [usuario_id, data_nascimento]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar paciente:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Listar pacientes
exports.listPacientes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, u.nome, u.email, p.data_nascimento
      FROM consultorio.pacientes p
      JOIN consultorio.usuarios u ON p.usuario_id = u.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar pacientes:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Criar usuário
exports.createUsuario = async (req, res) => {
  const { nome, email, senha, papel } = req.body;

  if (!nome || !email || !senha || !papel) {
    return res.status(400).json({ error: 'nome, email, senha e papel são obrigatórios.' });
  }

  try {
    // Verificar se email já está cadastrado
    const emailExiste = await pool.query('SELECT id FROM consultorio.usuarios WHERE email = $1', [email]);
    if (emailExiste.rowCount > 0) {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }

    const saltRounds = 10;
    const hashedSenha = await bcrypt.hash(senha, saltRounds);

    const result = await pool.query(
      'INSERT INTO consultorio.usuarios (nome, email, senha, papel) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, papel',
      [nome, email, hashedSenha, papel]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
