const pool = require("../models/db");

exports.listarArquivos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM arquivos");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar arquivos:", err);
    res.status(500).json({ erro: "Erro interno do servidor ao listar arquivos" });
  }
};

exports.uploadArquivo = async (req, res) => {
  // Aqui vai a lógica de upload (exemplo se usar multer)
  res.json({ mensagem: "Arquivo enviado com sucesso" });
};
