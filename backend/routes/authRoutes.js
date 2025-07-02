const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Rotas
router.post('/login', authController.login);
router.post('/registrar', authController.registrar || (() => {}));

module.exports = router;
