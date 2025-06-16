const db = require("../models/db");

// Listar todos os pacientes
async function listarPacientes(req, res) {
  try {
    const resultado = await db.query("SELECT * FROM consultorio.pacientes ORDER BY nome");
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar pacientes" });
  }
}

// Buscar paciente por ID
async function buscarPaciente(req, res) {
  const { id } = req.params;
  try {
    const resultado = await db.query("SELECT * FROM consultorio.pacientes WHERE id = $1", [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar paciente" });
  }
}

// Criar paciente
async function criarPaciente(req, res) {
  const { nome, email, telefone, data_nascimento } = req.body;
  try {
    const resultado = await db.query(
      "INSERT INTO consultorio.pacientes (nome, email, telefone, data_nascimento) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, email, telefone, data_nascimento]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar paciente" });
  }
}

// Atualizar paciente
async function atualizarPaciente(req, res) {
  const { id } = req.params;
  const { nome, email, telefone, data_nascimento } = req.body;
  try {
    const resultado = await db.query(
      "UPDATE consultorio.pacientes SET nome=$1, email=$2, telefone=$3, data_nascimento=$4 WHERE id=$5 RETURNING *",
      [nome, email, telefone, data_nascimento, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar paciente" });
  }
}

// Deletar paciente
async function deletarPaciente(req, res) {
  const { id } = req.params;
  try {
    const resultado = await db.query("DELETE FROM consultorio.pacientes WHERE id = $1 RETURNING *", [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado" });
    }
    res.json({ mensagem: "Paciente deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao deletar paciente" });
  }
}

module.exports = {
  listarPacientes,
  buscarPaciente,
  criarPaciente,
  atualizarPaciente,
  deletarPaciente,
};
