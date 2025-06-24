const pool = require('../models/db');

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

exports.consultasPorDiaSemana = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          TO_CHAR(c.data, 'Day') AS dia_semana,
          COUNT(c.id) AS total_consultas
        FROM consultorio.consultas c
        WHERE DATE_TRUNC('month', c.data) = DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY TO_CHAR(c.data, 'Day')
        ORDER BY
          CASE
            WHEN TO_CHAR(c.data, 'Day') LIKE 'Monday%' THEN 1
            WHEN TO_CHAR(c.data, 'Day') LIKE 'Tuesday%' THEN 2
            WHEN TO_CHAR(c.data, 'Day') LIKE 'Wednesday%' THEN 3
            WHEN TO_CHAR(c.data, 'Day') LIKE 'Thursday%' THEN 4
            WHEN TO_CHAR(c.data, 'Day') LIKE 'Friday%' THEN 5
            WHEN TO_CHAR(c.data, 'Day') LIKE 'Saturday%' THEN 6
            WHEN TO_CHAR(c.data, 'Day') LIKE 'Sunday%' THEN 7
            ELSE 8
          END
      `);
      res.json(result.rows);
    } catch (err) {
      console.error('Erro em consultasPorDiaSemana:', err);
      res.status(500).json({ error: 'Erro ao obter consultas por dia da semana.' });
    }
  };

exports.obterEstatisticas = async (req, res) => {
    try {
        // Total consultas hoje
        const consultasHojeResult = await pool.query(`
      SELECT COUNT(*) AS total
      FROM consultorio.consultas
      WHERE DATE(data) = CURRENT_DATE
    `);
        const consultasHoje = parseInt(consultasHojeResult.rows[0]?.total) || 0;

        // Total pacientes ativos — verifique se coluna 'status' existe e valores corretos
        const pacientesAtivosResult = await pool.query(`
      SELECT COUNT(*) AS total
      FROM consultorio.pacientes
      WHERE status = 'ativo'
    `);
        const pacientesAtivos = parseInt(pacientesAtivosResult.rows[0]?.total) || 0;

        // Novos cadastros no mês atual — verifique se 'data_cadastro' existe
        const novosCadastrosResult = await pool.query(`
      SELECT COUNT(*) AS total
      FROM consultorio.pacientes
      WHERE DATE_TRUNC('month', data_cadastro) = DATE_TRUNC('month', CURRENT_DATE)
    `);
        const novosCadastros = parseInt(novosCadastrosResult.rows[0]?.total) || 0;

        // Últimos 5 pacientes cadastrados
        const ultimosPacientesResult = await pool.query(`
      SELECT id, nome, email
      FROM consultorio.pacientes
      ORDER BY data_cadastro DESC
      LIMIT 5
    `);
        const ultimosPacientes = ultimosPacientesResult.rows;

        // Últimas 5 consultas
        const ultimasConsultasResult = await pool.query(`
      SELECT c.id, p.nome AS pacienteNome, m.nome AS medicoNome, c.data
      FROM consultorio.consultas c
      JOIN consultorio.pacientes p ON c.paciente_id = p.id
      JOIN consultorio.medicos m ON c.medico_id = m.id
      ORDER BY c.data DESC
      LIMIT 5
    `);
        const ultimasConsultas = ultimasConsultasResult.rows;

        res.json({
            consultasHoje,
            pacientesAtivos,
            novosCadastros,
            ultimosPacientes,
            ultimasConsultas
        });
    } catch (err) {
        console.error("Erro ao obter estatísticas:", err);
        res.status(500).json({ erro: "Erro ao obter estatísticas." });
    }
};

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

exports.consultasPorDiaSemanaPeriodo = async (req, res) => {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
        return res.status(400).json({ erro: "Parâmetros 'start_date' e 'end_date' são obrigatórios." });
    }

    try {
        const result = await pool.query(`
            SELECT 
                TO_CHAR(c.data, 'Day') AS dia_semana,
                COUNT(c.id) AS total_consultas
            FROM consultorio.consultas c
            WHERE c.data BETWEEN $1 AND $2
            GROUP BY TO_CHAR(c.data, 'Day')
            ORDER BY
                CASE
                    WHEN TO_CHAR(c.data, 'Day') LIKE 'Monday%' THEN 1
                    WHEN TO_CHAR(c.data, 'Day') LIKE 'Tuesday%' THEN 2
                    WHEN TO_CHAR(c.data, 'Day') LIKE 'Wednesday%' THEN 3
                    WHEN TO_CHAR(c.data, 'Day') LIKE 'Thursday%' THEN 4
                    WHEN TO_CHAR(c.data, 'Day') LIKE 'Friday%' THEN 5
                    WHEN TO_CHAR(c.data, 'Day') LIKE 'Saturday%' THEN 6
                    WHEN TO_CHAR(c.data, 'Day') LIKE 'Sunday%' THEN 7
                    ELSE 8
                END
        `, [start_date, end_date]);

        res.json(result.rows);
    } catch (err) {
        console.error("Erro consultasPorDiaSemanaPeriodo:", err);
        res.status(500).json({ erro: "Erro ao obter consultas por dia da semana no período." });
    }
};
