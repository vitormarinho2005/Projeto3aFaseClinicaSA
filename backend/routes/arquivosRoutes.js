const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const arquivosController = require("../controllers/arquivosController");

// Upload
router.post("/", upload.single("arquivo"), arquivosController.uploadArquivo);

// Listar
router.get("/", arquivosController.listarArquivos);

module.exports = router;
