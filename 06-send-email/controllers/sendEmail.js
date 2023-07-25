const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

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

// TODO: créer un compte sur sendGrid  (utiliser un mail valid
// TODO: créer un single sender
// TODO: Email API -> Integration Guide -> choose Web API -> Node.js
// TODO: créer une variable d'envrionnement SENDGRID_API_KEY
// TODO: npm i @sendgrid/mail
const sendEmail = async (_req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'thomas_3004@hotmail.fr',
    from: 'fixito59@gmail.com', // Changer pour notre sender vérifié
    subject: 'Envoyer avec SendGrid est marrant',
    text: "et facile à faire n'importe où, même avec Node.js",
    html: "<strong>et facile à faire n'importe où, même avec Node.js</strong>"
  };
  const info = await sgMail.send(msg);
  res.json(info);
};

module.exports = sendEmail;
