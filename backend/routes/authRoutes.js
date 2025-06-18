const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/authController');

<<<<<<< HEAD
router.post('/registrar', registrar);
=======
router.post("/registrar", registrar); 
>>>>>>> 309f41a (Quarto commit)
router.post('/login', login);

module.exports = router;