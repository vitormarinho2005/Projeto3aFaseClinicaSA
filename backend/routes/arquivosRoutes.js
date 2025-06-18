const express = require("express");
const router = express.Router();
const autenticarToken = require("../middlewares/authMiddleware");
const { listarArquivos } = require("../controllers/arquivosController");

router.get("/arquivos", autenticarToken, listarArquivos);

module.exports = router;
