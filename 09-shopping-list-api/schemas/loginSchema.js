const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required()
}).messages({
  'any.required': 'Le champs {#label} est requis.',
  'string.empty': 'Le champs {#label} ne peut être vide.'
});

module.exports = loginSchema;
