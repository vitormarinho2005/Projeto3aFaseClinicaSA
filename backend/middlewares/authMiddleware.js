const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // pode usar o payload do token se quiser
    next();
  } catch (err) {
    console.error('Erro no token:', err);
    return res.status(403).json({ mensagem: 'Token inválido ou expirado' });
  }
};
