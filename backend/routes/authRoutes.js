const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { login } = require('../controllers/authController');
const authController = require("../controllers/authController");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/login', login);
router.post("/registrar", authController.registrar);
router.post("/login", authController.login);

module.exports = router;
