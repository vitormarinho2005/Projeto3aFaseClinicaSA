const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  consultasPorDiaSemana,
  consultasPorMedicoPeriodo,
  consultasPorMedicoMes,
  consultasPorDiaSemanaPeriodo,
  obterEstatisticas
} = require('../controllers/dashboardController');

router.get('/consultas-medicos-mes', authMiddleware, consultasPorMedicoMes);
router.get('/consultas-medicos-periodo', authMiddleware, consultasPorMedicoPeriodo);
router.get('/consultas-dia-semana', authMiddleware, consultasPorDiaSemana);
router.get('/consultas-dia-semana-periodo', authMiddleware, consultasPorDiaSemanaPeriodo);
router.get('/dashboard', authMiddleware, obterEstatisticas);

module.exports = router;
