const pool = require('../models/db');

exports.consultasPorMedicoMes = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT m.nome AS medico, COUNT(c.id) AS total_consultas
      FROM consultas c
      JOIN medicos m ON c.medico_id = m.id
      WHERE DATE_TRUNC('month', c.data) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY m.nome
      ORDER BY total_consultas DESC
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.consultasPorDiaSemana = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT TO_CHAR(c.data, 'Day') AS dia_semana,
               COUNT(c.id) AS total_consultas
        FROM consultas c
        WHERE DATE_TRUNC('month', c.data) = DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY dia_semana
        ORDER BY
          CASE
            WHEN dia_semana LIKE 'Monday%' THEN 1
            WHEN dia_semana LIKE 'Tuesday%' THEN 2
            WHEN dia_semana LIKE 'Wednesday%' THEN 3
            WHEN dia_semana LIKE 'Thursday%' THEN 4
            WHEN dia_semana LIKE 'Friday%' THEN 5
            WHEN dia_semana LIKE 'Saturday%' THEN 6
            WHEN dia_semana LIKE 'Sunday%' THEN 7
            ELSE 8
          END
      `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.consultasPorMedicoPeriodo = async (req, res) => {
    try {
        const { dataInicio, dataFim } = req.query;

        if (!dataInicio || !dataFim) {
            return res.status(400).json({ error: 'Data inicial e final são obrigatórias' });
        }

        const result = await pool.query(`
        SELECT m.nome AS medico, COUNT(c.id) AS total_consultas
        FROM consultas c
        JOIN medicos m ON c.medico_id = m.id
        WHERE c.data BETWEEN $1 AND $2
        GROUP BY m.nome
        ORDER BY total_consultas DESC
      `, [dataInicio, dataFim]);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.consultasPorDiaSemanaPeriodo = async (req, res) => {
    try {
        const { dataInicio, dataFim } = req.query;

        if (!dataInicio || !dataFim) {
            return res.status(400).json({ error: 'Data inicial e final são obrigatórias' });
        }

        const result = await pool.query(`
        SELECT TO_CHAR(c.data, 'Day') AS dia_semana,
               COUNT(c.id) AS total_consultas
        FROM consultas c
        WHERE c.data BETWEEN $1 AND $2
        GROUP BY dia_semana
        ORDER BY
          CASE
            WHEN dia_semana LIKE 'Monday%' THEN 1
            WHEN dia_semana LIKE 'Tuesday%' THEN 2
            WHEN dia_semana LIKE 'Wednesday%' THEN 3
            WHEN dia_semana LIKE 'Thursday%' THEN 4
            WHEN dia_semana LIKE 'Friday%' THEN 5
            WHEN dia_semana LIKE 'Saturday%' THEN 6
            WHEN dia_semana LIKE 'Sunday%' THEN 7
            ELSE 8
          END
      `, [dataInicio, dataFim]);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obterEstatisticas = async (req, res) => {
    try {
        const consultasPorMes = await pool.query(`
        SELECT TO_CHAR(data, 'YYYY-MM') AS mes, COUNT(*) AS total
        FROM consultas
        GROUP BY mes
        ORDER BY mes
      `);

        const consultasPorMedico = await pool.query(`
        SELECT m.nome, COUNT(*) AS total
        FROM consultas c
        JOIN medicos m ON c.medico_id = m.id
        GROUP BY m.nome
        ORDER BY total DESC
      `);

        const consultasPorStatus = await pool.query(`
        SELECT status, COUNT(*) AS total
        FROM consultas
        GROUP BY status
      `);

        res.json({
            porMes: consultasPorMes.rows,
            porMedico: consultasPorMedico.rows,
            porStatus: consultasPorStatus.rows,
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};