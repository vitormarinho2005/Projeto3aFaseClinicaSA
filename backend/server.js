const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const arquivosRoutes = require("./routes/arquivosRoutes");
const medicosRoutes = require("./routes/medicosRoutes");
const pacientesRoutes = require("./routes/pacientesRoutes");
const consultasRoutes = require("./routes/consultasRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api", arquivosRoutes);
app.use('/api/medicos', medicosRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
