// backend/routes/arquivosRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configura onde salvar os arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir); // garante que a pasta exista
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const nomeUnico = `${Date.now()}-${file.originalname}`;
    cb(null, nomeUnico);
  },
});

const upload = multer({ storage });

// Lista todos os arquivos (simulado)
router.get('/arquivos', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) return res.status(500).json({ error: 'Erro ao listar arquivos' });

    const lista = files.map((nome, index) => ({
      id: index + 1,
      nome,
      caminho: `uploads/${nome}`,
    }));

    res.json(lista);
  });
});

// Envia um novo arquivo
router.post('/arquivos', upload.single('arquivo'), (req, res) => {
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
