const express = require('express');
const router = express.Router();

const {
  createUsuario,
  createMedico,
  listMedicos,
  createPaciente,
  listPacientes,
} = require('../controllers/userController');

router.post('/medicos', createMedico);
router.get('/medicos', listMedicos);

router.post('/pacientes', createPaciente);
router.get('/pacientes', listPacientes);

router.post('/usuarios', createUsuario);

module.exports = router;
