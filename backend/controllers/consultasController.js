const db = require("../models/db");

// Listar todas as consultas com dados de médico e paciente
async function listarConsultas(req, res) {
  try {
    const resultado = await db.query(`
      SELECT
        c.id,
        c.data,
        c.status,
        m.nome AS nome_medico,
        p.nome AS nome_paciente
      FROM consultorio.consultas c
      JOIN consultorio.medicos m ON c.medico_id = m.id
      JOIN consultorio.pacientes p ON c.paciente_id = p.id
      ORDER BY c.data DESC
    `);
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar consultas" });
  }
}

// Buscar consulta por ID
async function buscarConsulta(req, res) {
  const { id } = req.params;
  try {
    const resultado = await db.query(`
      SELECT
        c.id,
        c.data,
        c.status,
        m.nome AS nome_medico,
        p.nome AS nome_paciente
      FROM consultorio.consultas c
      JOIN consultorio.medicos m ON c.medico_id = m.id
      JOIN consultorio.pacientes p ON c.paciente_id = p.id
      WHERE c.id = $1
    `, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Consulta não encontrada" });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar consulta" });
  }
}

// Criar nova consulta (corrigido, sem o campo 'horario')
async function criarConsulta(req, res) {
  console.log("Recebido no body:", req.body);

  const { pacienteId, data, medicoId } = req.body;

  try {
    const resultado = await db.query(
      "INSERT INTO consultorio.consultas (paciente_id, data, medico_id) VALUES ($1, $2, $3) RETURNING *",
      [pacienteId, data, medicoId]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error("Erro ao criar consulta:", err);
    res.status(500).json({ erro: "Erro ao criar consulta" });
  }
}

// Atualizar status e/ou data
async function atualizarConsulta(req, res) {
  const { id } = req.params;
  const { data, status } = req.body;

  try {
    const resultado = await db.query(
      `UPDATE consultorio.consultas
       SET data = COALESCE($1, data),
           status = COALESCE($2, status)
       WHERE id = $3
       RETURNING *`,
      [data, status, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Consulta não encontrada" });
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar consulta" });
  }
}

// Deletar consulta
async function deletarConsulta(req, res) {
  const { id } = req.params;
  try {
    const resultado = await db.query(
      "DELETE FROM consultorio.consultas WHERE id = $1 RETURNING *",
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Consulta não encontrada" });
    }
    res.json({ mensagem: "Consulta deletada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao deletar consulta" });
  }
}

// Estatísticas (mock)
async function obterEstatisticas(req, res) {
  try {
    const estatisticas = {
      totalConsultas: 100,
      consultasPorMedico: [
        { medico: "Dr. João", total: 40 },
        { medico: "Dra. Maria", total: 60 },
      ],
    };

    res.json(estatisticas);
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
}

module.exports = {
  listarConsultas,
  buscarConsulta,
  criarConsulta,
  atualizarConsulta,
  deletarConsulta,
  obterEstatisticas,
};
