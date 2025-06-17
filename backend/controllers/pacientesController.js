const db = require("../models/db");

// Listar todos os pacientes
async function listarPacientes(req, res) {
  try {
    const resultado = await db.query("SELECT * FROM consultorio.pacientes ORDER BY id ASC");
    res.json(resultado.rows);
  } catch (err) {
    console.error("Erro ao listar pacientes:", err);
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
    console.error("Erro ao buscar paciente:", err);
    res.status(500).json({ erro: "Erro ao buscar paciente" });
  }
}

// Criar novo paciente
async function criarPaciente(req, res) {
  const { nome, idade, email, telefone } = req.body;

  try {
    const resultado = await db.query(
      "INSERT INTO consultorio.pacientes (nome, idade, email, telefone) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, idade, email, telefone]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error("Erro ao criar paciente:", err);
    res.status(500).json({ erro: "Erro ao criar paciente" });
  }
}

// Atualizar paciente existente
async function atualizarPaciente(req, res) {
  const { id } = req.params;
  const { nome, idade, email, telefone } = req.body;

  try {
    const resultado = await db.query(
      "UPDATE consultorio.pacientes SET nome = $1, idade = $2, email = $3, telefone = $4 WHERE id = $5 RETURNING *",
      [nome, idade, email, telefone, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado para atualização" });
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar paciente:", err);
    res.status(500).json({ erro: "Erro ao atualizar paciente" });
  }
}

// Deletar paciente
async function deletarPaciente(req, res) {
  const { id } = req.params;

  try {
    const resultado = await db.query(
      "DELETE FROM consultorio.pacientes WHERE id = $1 RETURNING *",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado para exclusão" });
    }

    res.json({ mensagem: "Paciente excluído com sucesso", paciente: resultado.rows[0] });
  } catch (err) {
    console.error("Erro ao deletar paciente:", err);
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
