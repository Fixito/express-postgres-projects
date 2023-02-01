const sendEmail = require('./sendEmail.js');

const sendVerificationEmail = ({ name, email, verificationToken, origin }) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Veuillz confirmer votre email en cliquant sur le lien suivant : <a href="${verifyEmail}">Vérifier mon email</a></p>`;

  return sendEmail({
    to: email,
    subject: 'Email de confirmation',
    html: `<h4>Bonjour ${name},</h4>
    ${message}
    `
  });
};

module.exports = sendVerificationEmail;
