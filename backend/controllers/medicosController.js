const db = require("../models/db");

// Listar todos os médicos
async function listarMedicos(req, res) {
  try {
    const resultado = await db.query("SELECT * FROM consultorio.medicos ORDER BY nome");
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar médicos" });
  }
}

// Buscar médico por ID
async function buscarMedico(req, res) {
  const { id } = req.params;
  try {
    const resultado = await db.query("SELECT * FROM consultorio.medicos WHERE id = $1", [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Médico não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar médico" });
  }
}

// Criar médico
async function criarMedico(req, res) {
  const { nome, email, telefone, especialidade } = req.body;
  try {
    const resultado = await db.query(
      "INSERT INTO consultorio.medicos (nome, email, telefone, especialidade) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, email, telefone, especialidade]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar médico" });
  }
}

// Atualizar médico
async function atualizarMedico(req, res) {
  const { id } = req.params;
  const { nome, email, telefone, especialidade } = req.body;
  try {
    const resultado = await db.query(
      "UPDATE consultorio.medicos SET nome=$1, email=$2, telefone=$3, especialidade=$4 WHERE id=$5 RETURNING *",
      [nome, email, telefone, especialidade, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Médico não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar médico" });
  }
}

// Deletar médico
async function deletarMedico(req, res) {
  const { id } = req.params;
  try {
    const resultado = await db.query("DELETE FROM consultorio.medicos WHERE id = $1 RETURNING *", [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Médico não encontrado" });
    }
    res.json({ mensagem: "Médico deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao deletar médico" });
  }
}

module.exports = {
  listarMedicos,
  buscarMedico,
  criarMedico,
  atualizarMedico,
  deletarMedico,
};
