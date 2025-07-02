const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

exports.upload = upload; // exportando o middleware multer

exports.enviarArquivo = (req, res) => {
    console.log('req.file:', req.file); // <<< ADICIONE ISSO para debugar
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    res.json({ mensagem: 'Arquivo enviado com sucesso', arquivo: req.file });
};

exports.listarArquivos = async (req, res) => {
    try {
        const uploadsPath = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsPath)) {
            fs.mkdirSync(uploadsPath);
        }
        const arquivos = await fs.promises.readdir(uploadsPath);

        // Retornar array com objetos, cada um com um id e nome, por exemplo:
        const arquivosComId = arquivos.map((nomeArquivo, index) => ({
            id: index,
            nome: nomeArquivo
        }));

        res.json(arquivosComId);
    } catch (error) {
        console.error('Erro ao listar arquivos:', error);
        res.status(500).json({ error: 'Erro interno ao listar arquivos' });
    }
};
