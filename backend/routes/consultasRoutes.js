const express = require("express");
const router = express.Router();
const consultasController = require("../controllers/consultasController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rota para criar consulta
router.post("/", consultasController.criarConsulta);

// Rota para listar consultas
router.get("/", authMiddleware, consultasController.listarConsultas);

// Rota para estatísticas
router.get("/estatisticas", authMiddleware, consultasController.obterEstatisticas);

module.exports = router;
