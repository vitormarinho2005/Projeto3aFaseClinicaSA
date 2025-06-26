const express = require('express');
const router = express.Router();

const { verificarToken, verificarPapeis } = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// Função helper para proteger rotas
function rotaProtegida(papeis, handler) {
  if (typeof handler !== 'function') {
    throw new TypeError('Handler deve ser uma função');
  }
  return [verificarToken, verificarPapeis(...papeis), handler];
}

// Rotas protegidas
router.get('/', ...rotaProtegida(['admin'], dashboardController.obterEstatisticas));
router.get('/consultas-medicos-mes', ...rotaProtegida(['admin', 'medico'], dashboardController.consultasPorMedicoMes));
router.get('/consultas-medicos-periodo', ...rotaProtegida(['admin', 'medico'], dashboardController.consultasPorMedicoPeriodo));
router.get('/consultas-dia-semana', ...rotaProtegida(['admin', 'medico', 'paciente'], dashboardController.consultasPorDiaSemana));
router.get('/consultas-dia-semana-periodo', ...rotaProtegida(['admin', 'medico', 'paciente'], dashboardController.consultasPorDiaSemanaPeriodo));
router.get('/agendamentos-especialidade-mes', ...rotaProtegida(['admin', 'medico'], dashboardController.agendamentosPorEspecialidadeMes));
router.get('/agendamentos-dia-mes', ...rotaProtegida(['admin', 'medico'], dashboardController.agendamentosPorDiaMes));
router.get('/estatisticas-gerais', verificarToken, verificarPapeis('admin'), dashboardController.estatisticasGerais);

module.exports = router;
