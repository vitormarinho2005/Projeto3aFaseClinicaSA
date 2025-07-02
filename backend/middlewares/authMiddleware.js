const jwt = require('jsonwebtoken');

// Verifica o token JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ erro: "Token não fornecido" });
  const token = authHeader.split(' ')[1];
  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}

// Verifica se o papel do usuário está entre os permitidos
function verificarPapeis(...papeisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !papeisPermitidos.includes(req.usuario.papel)) {
      return res.status(403).json({ erro: "Acesso negado: papel insuficiente" });
    }
    next();
  };
}

// Verifica se o usuário é admin
function verificarAdmin(req, res, next) {
  if (!req.usuario || req.usuario.papel !== 'admin') {
    return res.status(403).json({
      erro: "Acesso negado. Apenas administradores podem acessar esta rota.",
    });
  }
  next();
}

// ✅ Exporta tudo em um só lugar
module.exports = {
  verificarToken,
  verificarPapeis,
  verificarAdmin
};