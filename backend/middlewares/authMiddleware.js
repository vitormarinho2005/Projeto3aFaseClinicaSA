const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
<<<<<<< HEAD
    return res.status(403).json({ erro: "Token não fornecido" });
=======
    return res.status(401).json({ erro: "Token não fornecido" }); 
>>>>>>> 309f41a (Quarto commit)
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
<<<<<<< HEAD
    return res.status(403).json({ erro: "Token inválido" });
=======
    return res.status(401).json({ erro: "Token inválido" }); 
>>>>>>> 309f41a (Quarto commit)
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
<<<<<<< HEAD
        return res.status(401).json({ erro: "Token expirado" }); // status 401 para token expirado
      }
      return res.status(403).json({ erro: "Token inválido" });
=======
        return res.status(401).json({ erro: "Token expirado" }); 
      }
      return res.status(401).json({ erro: "Token inválido" }); 
>>>>>>> 309f41a (Quarto commit)
    }
    req.usuario = usuario;
    next();
  });
}

module.exports = autenticarToken;
