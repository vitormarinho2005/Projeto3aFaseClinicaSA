const express = require('express');
const bcrypt = require('bcrypt'); // importe no topo para evitar múltiplas require
const pool = require('../db'); // importe a conexão configurada

const router = express.Router();

router.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, papel } = req.body;

    if (!nome || !email || !senha || !papel) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Verifica se o email já existe
    const { rowCount } = await pool.query('SELECT 1 FROM usuarios WHERE email = $1', [email]);
    if (rowCount > 0) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    // Faz hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Insere o usuário no banco
    await pool.query(
      'INSERT INTO usuarios (nome, email, senha, papel) VALUES ($1, $2, $3, $4)',
      [nome, email, senhaHash, papel]
    );

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

module.exports = router;
