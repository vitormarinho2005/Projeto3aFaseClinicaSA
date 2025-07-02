const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const isAdminMiddleware = require('../middlewares/isAdminMiddleware');
const {
  consultasPorDiaSemana,
  consultasPorMedicoPeriodo,
  consultasPorMedicoMes,
  consultasPorDiaSemanaPeriodo,
  obterEstatisticas
} = require('../controllers/dashboardController');

// Protege todas as rotas com auth + admin
router.use(authMiddleware, isAdminMiddleware);

router.get('/consultas-medicos-mes', consultasPorMedicoMes);
router.get('/consultas-medicos-periodo', consultasPorMedicoPeriodo);
router.get('/consultas-dia-semana', consultasPorDiaSemana);
router.get('/consultas-dia-semana-periodo', consultasPorDiaSemanaPeriodo);
router.get('/', obterEstatisticas);

module.exports = router;