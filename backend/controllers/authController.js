const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "segredo_supersecreto";

// --- LOGIN ---
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    const resultado = await db.query(
      "SELECT id, nome, email, senha FROM consultorio.usuarios WHERE email = $1",
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado." });
    }

    const usuario = resultado.rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    delete usuario.senha; // remove a senha antes de enviar para o frontend

    return res.status(200).json({ token, usuario });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}

// --- REGISTRAR ---
async function registrar(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
    }

    const existente = await db.query(
      "SELECT id FROM consultorio.usuarios WHERE email = $1",
      [email]
    );
    if (existente.rows.length > 0) {
      return res.status(409).json({ erro: "Email já cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await db.query(
      "INSERT INTO consultorio.usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, senhaHash]
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}

// --- EXPORTANDO TUDO ---
module.exports = {
  login,
  registrar
};
