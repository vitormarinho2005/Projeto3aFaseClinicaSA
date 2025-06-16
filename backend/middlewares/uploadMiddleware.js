const multer = require("multer");
const path = require("path");

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const nomeOriginal = file.originalname.replace(/\s+/g, "_");
    const nomeFinal = `${Date.now()}-${nomeOriginal}`;
    cb(null, nomeFinal);
  }
});

const upload = multer({ storage });

module.exports = upload;
