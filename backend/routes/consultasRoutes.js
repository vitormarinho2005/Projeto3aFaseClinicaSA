const express = require("express");
const router = express.Router();
const consultasController = require("../controllers/consultasController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rota atual para listar consultas
router.get("/", authMiddleware, consultasController.listarConsultas);

// NOVA rota para estatísticas
router.get("/estatisticas", authMiddleware, consultasController.obterEstatisticas);

module.exports = router;
