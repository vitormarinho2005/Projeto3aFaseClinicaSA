// authMiddleware.js
const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("Token não fornecido");
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      console.log("Token inválido ou expirado:", err.message);
      return res.status(403).json({ erro: 'Token inválido' });
    }
    req.usuario = usuario;
    console.log("Usuário autenticado:", usuario);
    next();
  });
}

function verificarPapeis(...papeisPermitidos) {
  return (req, res, next) => {
    const usuario = req.usuario;
    if (!usuario) {
      console.log("Usuário não autenticado");
      return res.status(403).json({ erro: "Acesso não autorizado" });
    }
    if (!papeisPermitidos.includes(usuario.papel)) {
      console.log("Papel do usuário não permitido:", usuario.papel);
      return res.status(403).json({ erro: "Acesso não autorizado" });
    }
    next();
  };
}

module.exports = autenticarToken;
