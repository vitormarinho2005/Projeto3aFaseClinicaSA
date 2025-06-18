const pool = require('../models/db');

// Criar médico (precisa de usuário já cadastrado)
exports.createMedico = async (req, res) => {
  const { usuario_id, especialidade, crm } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO medicos (usuario_id, especialidade, crm) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, especialidade, crm]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar médicos
exports.listMedicos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, u.nome, u.email, m.especialidade, m.crm
      FROM medicos m
      JOIN usuarios u ON m.usuario_id = u.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Criar paciente (precisa de usuário já cadastrado)
exports.createPaciente = async (req, res) => {
  const { usuario_id, data_nascimento } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pacientes (usuario_id, data_nascimento) VALUES ($1, $2) RETURNING *',
      [usuario_id, data_nascimento]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar pacientes
exports.listPacientes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, u.nome, u.email, p.data_nascimento
      FROM pacientes p
      JOIN usuarios u ON p.usuario_id = u.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Criar usuário
exports.createUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    // Criptografar senha
    const saltRounds = 10;
    const hashedSenha = await bcrypt.hash(senha, saltRounds);
    
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha] // depois pode implementar hash na senha
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
