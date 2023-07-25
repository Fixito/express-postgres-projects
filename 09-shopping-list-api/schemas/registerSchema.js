const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required()
  // role: Joi.string().valid('user', 'admin').required()
}).messages({
  'any.required': 'Le champs {#label} est requis.',
  'string.empty': 'Le champs {#label} ne peut être vide.'
});

module.exports = registerSchema;
