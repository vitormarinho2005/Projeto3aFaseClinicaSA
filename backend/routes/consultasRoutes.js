const express = require("express");
const router = express.Router();
const consultasController = require("../controllers/consultasController");

// GET /api/consultas
router.get("/", consultasController.listarConsultas);

// GET /api/consultas/:id
router.get("/:id", consultasController.buscarConsulta);

// POST /api/consultas
router.post("/", consultasController.criarConsulta);

// PUT /api/consultas/:id
router.put("/:id", consultasController.atualizarConsulta);

// DELETE /api/consultas/:id
router.delete("/:id", consultasController.deletarConsulta);

module.exports = router;
