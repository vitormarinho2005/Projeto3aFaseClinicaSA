// backend/routes/arquivosRoutes.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const arquivosController = require('../controllers/arquivosController');

// Configuração do multer para salvar arquivos na pasta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const nomeUnico = `${Date.now()}-${file.originalname}`;
    cb(null, nomeUnico);
  },
});

const upload = multer({ storage });

// Rota GET para listar arquivos, usando controller
router.get('/', arquivosController.listarArquivos);

// Rota POST para upload de arquivo
router.post('/', upload.single('arquivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  res.status(201).json({
    message: 'Arquivo enviado com sucesso',
    nome: req.file.originalname,
    caminho: req.file.path,
  });
});

module.exports = router;
