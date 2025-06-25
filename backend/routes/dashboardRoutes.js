// backend/routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();

const autenticarToken = require('../middlewares/authMiddleware');
const verificarPapeis = require('../middlewares/verificarPapeis');

const {
  consultasPorMedicoMes,
  consultasPorMedicoPeriodo,
  consultasPorDiaSemana,
  consultasPorDiaSemanaPeriodo,
  obterEstatisticas
} = require('../controllers/dashboardController');

// Rotas protegidas do dashboard
router.get('/', autenticarToken, verificarPapeis('admin'), obterEstatisticas);

router.get('/consultas-medicos-mes', autenticarToken, verificarPapeis('medico', 'admin'), consultasPorMedicoMes);

router.get('/consultas-medicos-periodo', autenticarToken, verificarPapeis('medico', 'admin'), consultasPorMedicoPeriodo);

router.get('/consultas-dia-semana', autenticarToken, verificarPapeis('medico', 'admin', 'paciente'), consultasPorDiaSemana);

router.get('/consultas-dia-semana-periodo', autenticarToken, verificarPapeis('medico', 'admin', 'paciente'), consultasPorDiaSemanaPeriodo);

module.exports = router;
