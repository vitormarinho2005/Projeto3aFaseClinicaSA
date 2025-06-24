const express = require('express');
const router = express.Router();
const arquivoController = require('../controllers/arquivosController');

// GET /api/arquivos
router.get('/arquivos', arquivoController.listarArquivos);

module.exports = router;
