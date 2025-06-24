const db = require("../models/db");

// Listar todos os pacientes
async function listarPacientes(req, res) {
  try {
    const resultado = await db.query("SELECT * FROM consultorio.pacientes ORDER BY id ASC");
    return res.json(resultado.rows);
  } catch (err) {
    console.error("Erro ao listar pacientes:", err);
    return res.status(500).json({ erro: "Erro interno ao listar pacientes" });
  }
}

// Buscar paciente por ID
async function buscarPaciente(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: "ID do paciente é obrigatório" });
  }

  try {
    const resultado = await db.query("SELECT * FROM consultorio.pacientes WHERE id = $1", [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado" });
    }

    return res.json(resultado.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar paciente:", err);
    return res.status(500).json({ erro: "Erro interno ao buscar paciente" });
  }
}

// Criar novo paciente
async function criarPaciente(req, res) {
  const { nome, idade, email, telefone } = req.body;

  // Validação básica dos campos obrigatórios
  if (!nome || !email) {
    return res.status(400).json({ erro: "Nome e email são obrigatórios" });
  }

  try {
    const resultado = await db.query(
      `INSERT INTO consultorio.pacientes (nome, idade, email, telefone) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome, idade || null, email, telefone || null]
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error("Erro ao criar paciente:", err);
    return res.status(500).json({ erro: "Erro interno ao criar paciente" });
  }
}

// Atualizar paciente existente
async function atualizarPaciente(req, res) {
  const { id } = req.params;
  const { nome, idade, email, telefone } = req.body;

  if (!id) {
    return res.status(400).json({ erro: "ID do paciente é obrigatório" });
  }
  if (!nome || !email) {
    return res.status(400).json({ erro: "Nome e email são obrigatórios para atualização" });
  }

  try {
    const resultado = await db.query(
      `UPDATE consultorio.pacientes 
       SET nome = $1, idade = $2, email = $3, telefone = $4 
       WHERE id = $5 RETURNING *`,
      [nome, idade || null, email, telefone || null, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado para atualização" });
    }

    return res.json(resultado.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar paciente:", err);
    return res.status(500).json({ erro: "Erro interno ao atualizar paciente" });
  }
}

// Deletar paciente
async function deletarPaciente(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ erro: "ID do paciente é obrigatório" });
  }

  try {
    const resultado = await db.query(
      "DELETE FROM consultorio.pacientes WHERE id = $1 RETURNING *",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado para exclusão" });
    }

    return res.json({ mensagem: "Paciente excluído com sucesso", paciente: resultado.rows[0] });
  } catch (err) {
    console.error("Erro ao deletar paciente:", err);
    return res.status(500).json({ erro: "Erro interno ao deletar paciente" });
  }
}

module.exports = {
  listarPacientes,
  buscarPaciente,
  criarPaciente,
  atualizarPaciente,
  deletarPaciente,
};
