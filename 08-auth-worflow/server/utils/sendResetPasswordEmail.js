const sendEmail = require('./sendEmail.js');

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?email=${email}&token=${token}`;
  const message = `<p>Veuillez rĂ©initialiser le mot de passe en cliquant sur le lien suivant : <a href="${resetURL}">RĂ©initialiser le mot de passe</a></p>`;

  return sendEmail({
    to: email,
    subject: 'RĂ©initialiser le mot de passe',
    html: `<h4>Bonjour ${name},</h4>
    ${message}
    `
  });
};

module.exports = sendResetPasswordEmail;
