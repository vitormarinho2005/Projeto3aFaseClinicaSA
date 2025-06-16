const pool = require('../db');

exports.getDashboardData = async (req, res) => {
  try {
    const totalMedicos = await pool.query('SELECT COUNT(*) FROM medicos');
    const totalPacientes = await pool.query('SELECT COUNT(*) FROM pacientes');
    
    const consultasPorMes = await pool.query(`
      SELECT TO_CHAR(data_hora, 'YYYY-MM') as mes, COUNT(*) as total
      FROM consultas
      GROUP BY mes
      ORDER BY mes
    `);

    res.json({
      medicos: totalMedicos.rows[0].count,
      pacientes: totalPacientes.rows[0].count,
      consultasPorMes: consultasPorMes.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
