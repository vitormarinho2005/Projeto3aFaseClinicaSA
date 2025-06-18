<<<<<<< HEAD
const bcrypt = require('bcrypt');

async function gerarSenha() {
  const senhaPlana = '123456';
  const hash = await bcrypt.hash(senhaPlana, 10);
  console.log("Hash gerado:", hash);
}

gerarSenha();
=======
const bcrypt = require("bcrypt");

async function gerarHash() {
  const hash = await bcrypt.hash("123456", 10);
  console.log("Hash:", hash);
}

gerarHash();
>>>>>>> 309f41a (Quarto commit)
