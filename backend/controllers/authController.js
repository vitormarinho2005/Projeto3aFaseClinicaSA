const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "segredo";

async function registrar(req, res) {
  const { nome, email, senha } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await db.query(
      "INSERT INTO consultorio.usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, senhaHash]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const resultado = await db.query(
      "SELECT * FROM consultorio.usuarios WHERE email = $1",
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const usuario = resultado.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
      expiresIn: "4h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
}

module.exports = {
  registrar,
  login,
};
