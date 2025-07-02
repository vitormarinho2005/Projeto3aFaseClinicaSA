function verificarAdmin(req, res, next) {
    // Garante que o usuário está autenticado e é admin
    if (!req.usuario || req.usuario.papel !== 'admin') {
        return res.status(403).json({
            erro: "Acesso negado. Apenas administradores podem acessar esta rota.",
        });
    }

    next(); // Continua para a próxima função da rota
}

module.exports = verificarAdmin;

