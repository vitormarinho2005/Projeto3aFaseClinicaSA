const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_REMETENTE,
    pass: process.env.EMAIL_SENHA,
  },
});

const enviarEmail = async (para, assunto, textoHtml) => {
  const mailOptions = {
    from: `"Clínica Médica" <${process.env.EMAIL_REMETENTE}>`,
    to: para,
    subject: assunto,
    html: textoHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ E-mail enviado para ${para}`);
  } catch (error) {
    console.error(`❌ Erro ao enviar e-mail: ${error.message}`);
  }
};

module.exports = enviarEmail;
