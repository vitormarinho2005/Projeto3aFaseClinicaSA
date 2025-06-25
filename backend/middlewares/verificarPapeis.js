function verificarPapeis(...papeisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario || !papeisPermitidos.includes(req.usuario.papel)) {
            return res.status(403).json({
                erro: `Acesso negado. Permissão requerida: ${papeisPermitidos.join(', ')}.`,
            });
        }
        next();
    };
}

module.exports = verificarPapeis;
