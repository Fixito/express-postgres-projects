const nodemailer = require('nodemailer');

// TODO: npm i nodemailer
const sendEmailEtheral = async (_req, res) => {
  // TODO: Créer un compte fictif sur https://ethereal.email/

  // Génère un compte de service SMTP de test à partir de ethereal.email
  // Nécessaire uniquement si vous n'avez pas de compte de messagerie réel pour les tests
  // const testAccount = await nodemailer.createTestAccount();

  // Crée un objet transporteur réutilisable en utilisant le transport SMTP par défaut
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'coty27@ethereal.email',
      pass: 'Dz17mQhmUmXBdZrGCj'
    }
  });

  // Envoie un mail avec un objet de transport défini
  const info = await transporter.sendMail({
    from: '"ForEach Academy 👻" <foreach-academy@gmail.com>',
    to: 'coty27@ethereal.email',
    subject: 'Hello',
    html: '<h1>Email envoyé avec Node.js</h1>'
  });

  res.json(info);
};

module.exports = sendEmailEtheral;
