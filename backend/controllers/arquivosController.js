// backend/controllers/arquivosController.js
const fs = require('fs');
const path = require('path');

exports.listarArquivos = async (req, res) => {
  try {
    const pastaUploads = path.join(__dirname, '..', 'uploads');

    if (!fs.existsSync(pastaUploads)) {
      console.log('Pasta uploads não existia — criando...');
      fs.mkdirSync(pastaUploads);
    }

    const arquivos = await fs.promises.readdir(pastaUploads);

    // Monta objeto para cada arquivo
    const lista = arquivos.map((nome, index) => ({
      id: index + 1,
      nome,
      caminho: `/uploads/${nome}`, // caminho para servir arquivo estático
    }));

    res.json(lista);
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ error: 'Erro interno ao listar arquivos' });
  }
};
