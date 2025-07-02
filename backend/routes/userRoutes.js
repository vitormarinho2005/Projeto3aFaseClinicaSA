const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController'); // Crie este controller com as funções abaixo

// Listar todos os usuários
router.get('/', userController.listarUsuarios);

// Buscar usuário por ID
router.get('/:id', userController.buscarUsuario);

// Criar usuário (Cadastro)
router.post('/', userController.criarUsuario);

// Atualizar usuário por ID
router.put('/:id', userController.atualizarUsuario);

// Deletar usuário por ID
router.delete('/:id', userController.deletarUsuario);

module.exports = router;
