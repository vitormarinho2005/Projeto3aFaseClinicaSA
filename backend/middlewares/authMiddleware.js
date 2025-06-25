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

// Apenas admin pode acessar estatísticas gerais
router.get('/', autenticarToken, verificarPapeis('admin'), obterEstatisticas);

// Médicos e admin podem acessar consultas por médico no mês
router.get('/consultas-medicos-mes', autenticarToken, verificarPapeis('medico', 'admin'), consultasPorMedicoMes);

// Médicos e admin podem acessar consultas por médico em período
router.get('/consultas-medicos-periodo', autenticarToken, verificarPapeis('medico', 'admin'), consultasPorMedicoPeriodo);

// Médicos, admin e pacientes podem ver consultas por dia da semana
router.get('/consultas-dia-semana', autenticarToken, verificarPapeis('medico', 'admin', 'paciente'), consultasPorDiaSemana);

router.get('/consultas-dia-semana-periodo', autenticarToken, verificarPapeis('medico', 'admin', 'paciente'), consultasPorDiaSemanaPeriodo);

module.exports = router;
