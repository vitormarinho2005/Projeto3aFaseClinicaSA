const fs = require('fs');
const path = require('path');

exports.listarArquivos = async (req, res) => {
  try {
    const pastaUploads = path.join(__dirname, '..', 'uploads');

    // Verifica se a pasta existe — se não, cria
    if (!fs.existsSync(pastaUploads)) {
      console.log('Pasta uploads não existia — criando...');
      fs.mkdirSync(pastaUploads);
    }

    // Lê os arquivos da pasta
    const arquivos = await fs.promises.readdir(pastaUploads);

    console.log('Arquivos encontrados:', arquivos);

    res.json(arquivos); // Responde com o array de arquivos
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ error: 'Erro interno ao listar arquivos' });
  }
};
