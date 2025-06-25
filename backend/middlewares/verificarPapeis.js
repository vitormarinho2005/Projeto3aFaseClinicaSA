function verificarPapeis(...papeisPermitidos) {
    return (req, res, next) => {
      const usuario = req.usuario;
  
      if (!usuario || !usuario.papel) {
        return res.status(403).json({ erro: "Acesso não autorizado: usuário ou papel não encontrado" });
      }
  
      if (!papeisPermitidos.includes(usuario.papel)) {
        return res.status(403).json({ erro: "Acesso não autorizado: papel insuficiente" });
      }
  
      next();
    };
  }
  
  module.exports = verificarPapeis;
  