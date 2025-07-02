const express = require("express");
const router = express.Router();
const medicosController = require("../controllers/medicosController");

// Rota para listar médicos
router.get("/", medicosController.listarMedicos);

// Rota para buscar médico por id
router.get("/:id", medicosController.buscarMedico);

// Rota para criar médico
router.post("/", medicosController.criarMedico);

// Rota para atualizar médico
router.put("/:id", medicosController.atualizarMedico);

// Rota para deletar médico
router.delete("/:id", medicosController.deletarMedico);

module.exports = router;
