const express = require("express");
const router = express.Router();
const pacientesController = require("../controllers/pacientesController");

// Listar todos
router.get("/", pacientesController.listarPacientes);

// Buscar um por ID
router.get("/:id", pacientesController.buscarPaciente);

// Criar
router.post("/", pacientesController.criarPaciente);

// Atualizar
router.put("/:id", pacientesController.atualizarPaciente);

// Deletar
router.delete("/:id", pacientesController.deletarPaciente);

module.exports = router;
