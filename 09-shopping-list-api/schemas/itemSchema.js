const Joi = require('joi');

const itemSchema = Joi.object({
  name: Joi.string().trim().required()
}).messages({
  'any.required': 'Le champs {#label} est requis.',
  'string.empty': 'Le champs ne peut être vide.'
});

module.exports = itemSchema;
