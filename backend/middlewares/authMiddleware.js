const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ erro: "Token inválido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ erro: "Token expirado" });
      }
      return res.status(401).json({ erro: "Token inválido" });
    }
    req.usuario = usuario;
    next();
  });
}

module.exports = autenticarToken;
