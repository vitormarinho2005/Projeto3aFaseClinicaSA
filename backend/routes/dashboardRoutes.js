const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// 📊 Gráficos principais
router.get('/agendamentos-especialidade-mes', dashboardController.agendamentosPorEspecialidadeMes);
router.get('/agendamentos-dia-mes', dashboardController.agendamentosPorDiaMes);
router.get('/estatisticas-gerais', dashboardController.estatisticasGerais);

// 📈 Relatórios por médico e por dia da semana
router.get('/consultas-medico-mes', dashboardController.consultasPorMedicoMes);
router.get('/consultas-dia-semana', dashboardController.consultasPorDiaSemana);

// 📅 Relatórios por período (com filtros de data)
router.get('/consultas-medico-periodo', dashboardController.consultasPorMedicoPeriodo);
router.get('/consultas-dia-semana-periodo', dashboardController.consultasPorDiaSemanaPeriodo);

module.exports = router;
