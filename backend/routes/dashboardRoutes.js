const express = require('express');
const router = express.Router();

const { verificarToken, verificarPapeis } = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// Rotas protegidas com autenticação e verificação de papéis

router.get(
  '/',
  verificarToken,
  verificarPapeis('admin'),
  dashboardController.obterEstatisticas
);

router.get(
  '/consultas-medicos-mes',
  verificarToken,
  verificarPapeis('admin', 'medico'),
  dashboardController.consultasPorMedicoMes
);

router.get(
  '/consultas-medicos-periodo',
  verificarToken,
  verificarPapeis('admin', 'medico'),
  dashboardController.consultasPorMedicoPeriodo
);

router.get(
  '/consultas-dia-semana',
  verificarToken,
  verificarPapeis('admin', 'medico', 'paciente'),
  dashboardController.consultasPorDiaSemana
);

router.get(
  '/consultas-dia-semana-periodo',
  verificarToken,
  verificarPapeis('admin', 'medico', 'paciente'),
  dashboardController.consultasPorDiaSemanaPeriodo
);

router.get(
  '/estatisticas-gerais',
  verificarToken,
  verificarPapeis('admin'),
  dashboardController.estatisticasGerais
);

router.get(
  '/agendamentos-especialidade-mes',
  verificarToken,
  verificarPapeis('admin', 'medico'),
  dashboardController.agendamentosPorEspecialidadeMes
);

router.get(
  '/agendamentos-dia-mes',
  verificarToken,
  verificarPapeis('admin', 'medico'),
  dashboardController.agendamentosPorDiaMes
);

module.exports = router;
