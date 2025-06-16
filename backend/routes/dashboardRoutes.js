const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { consultasPorMedicoMes } = require('../controllers/dashboardController');

router.get('/consultas-medicos', authMiddleware, consultasPorMedicoMes);
router.get('/consultas-dia-semana', authMiddleware, consultasPorDiaSemana);
router.get('/consultas-medicos', authMiddleware, consultasPorMedicoPeriodo);
router.get('/consultas-dia-semana', authMiddleware, consultasPorDiaSemanaPeriodo);
router.get("/dashboard", authMiddleware, obterEstatisticas);

module.exports = router;
