const pool = require('../models/db');

// Consultas por médico no mês atual
exports.consultasPorMedicoMes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.nome AS nome, COUNT(c.id) AS total
      FROM consultorio.consultas c
      JOIN consultorio.medicos m ON c.medico_id = m.id
      WHERE DATE_TRUNC('month', c.data) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY m.nome
      ORDER BY total DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Erro consultasPorMedicoMes:", err);
    res.status(500).json({ erro: "Erro ao obter consultas por médico no mês." });
  }
};

// Consultas por dia da semana (no mês atual)
exports.consultasPorDiaSemana = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TRIM(TO_CHAR(c.data, 'Day')) AS dia_semana,
        COUNT(c.id) AS total_consultas
      FROM consultorio.consultas c
      WHERE DATE_TRUNC('month', c.data) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY TRIM(TO_CHAR(c.data, 'Day'))
      ORDER BY
        CASE TRIM(TO_CHAR(c.data, 'Day'))
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
          ELSE 8
        END
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Erro em consultasPorDiaSemana:", err);
    res.status(500).json({ erro: "Erro ao obter consultas por dia da semana." });
  }
};

// Estatísticas gerais
exports.obterEstatisticas = async (req, res) => {
  try {
    const [consultasHoje, pacientesAtivos, novosCadastros, ultimosPacientes, ultimasConsultas] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS total FROM consultorio.consultas WHERE DATE(data) = CURRENT_DATE`),
      pool.query(`SELECT COUNT(*) AS total FROM consultorio.pacientes WHERE status = 'ativo'`),
      pool.query(`SELECT COUNT(*) AS total FROM consultorio.pacientes WHERE DATE_TRUNC('month', data_cadastro) = DATE_TRUNC('month', CURRENT_DATE)`),
      pool.query(`SELECT id, nome, email FROM consultorio.pacientes ORDER BY data_cadastro DESC LIMIT 5`),
      pool.query(`
        SELECT c.id, p.nome AS pacienteNome, m.nome AS medicoNome, c.data
        FROM consultorio.consultas c
        JOIN consultorio.pacientes p ON c.paciente_id = p.id
        JOIN consultorio.medicos m ON c.medico_id = m.id
        ORDER BY c.data DESC
        LIMIT 5
      `),
    ]);

    res.json({
      consultasHoje: parseInt(consultasHoje.rows[0].total) || 0,
      pacientesAtivos: parseInt(pacientesAtivos.rows[0].total) || 0,
      novosCadastros: parseInt(novosCadastros.rows[0].total) || 0,
      ultimosPacientes: ultimosPacientes.rows,
      ultimasConsultas: ultimasConsultas.rows
    });
  } catch (err) {
    console.error("Erro ao obter estatísticas:", err);
    res.status(500).json({ erro: "Erro ao obter estatísticas." });
  }
};

// Consultas por médico em período
exports.consultasPorMedicoPeriodo = async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ erro: "Parâmetros 'start_date' e 'end_date' são obrigatórios." });
  }

  try {
    const result = await pool.query(`
      SELECT m.nome AS nome, COUNT(c.id) AS total
      FROM consultorio.consultas c
      JOIN consultorio.medicos m ON c.medico_id = m.id
      WHERE c.data BETWEEN $1 AND $2
      GROUP BY m.nome
      ORDER BY total DESC
    `, [start_date, end_date]);

    res.json(result.rows);
  } catch (err) {
    console.error("Erro consultasPorMedicoPeriodo:", err);
    res.status(500).json({ erro: "Erro ao obter consultas por médico no período." });
  }
};

// Consultas por dia da semana em período
exports.consultasPorDiaSemanaPeriodo = async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ erro: "Parâmetros 'start_date' e 'end_date' são obrigatórios." });
  }

  try {
    const result = await pool.query(`
      SELECT 
        TRIM(TO_CHAR(c.data, 'Day')) AS dia_semana,
        COUNT(c.id) AS total_consultas
      FROM consultorio.consultas c
      WHERE c.data BETWEEN $1 AND $2
      GROUP BY TRIM(TO_CHAR(c.data, 'Day'))
      ORDER BY
        CASE TRIM(TO_CHAR(c.data, 'Day'))
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
          ELSE 8
        END
    `, [start_date, end_date]);

    res.json(result.rows);
  } catch (err) {
    console.error("Erro consultasPorDiaSemanaPeriodo:", err);
    res.status(500).json({ erro: "Erro ao obter consultas por dia da semana no período." });
  }
};
