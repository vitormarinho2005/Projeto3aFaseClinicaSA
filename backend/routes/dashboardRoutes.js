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

// Aplica autenticação e checagem de admin em todas as rotas deste router
router.use(authMiddleware, isAdminMiddleware);

// Rotas do dashboard
router.get('/consultas-medicos-mes', consultasPorMedicoMes);
router.get('/consultas-medicos-periodo', consultasPorMedicoPeriodo);
router.get('/consultas-dia-semana', consultasPorDiaSemana);
router.get('/consultas-dia-semana-periodo', consultasPorDiaSemanaPeriodo);
router.get('/estatisticas-gerais', obterEstatisticas);

module.exports = router;
