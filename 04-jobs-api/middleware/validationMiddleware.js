const { body, validationResult, param } = require('express-validator');
const { BadRequestError, NotFoundError } = require('../errors');
const db = require('../db');
const { JOB_STATUS } = require('../utils/constants.js');

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, _res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        const firstMessage = errorMessages[0];

        if (firstMessage.startsWith("Pas d'offre")) {
          throw new NotFoundError(errorMessages);
        }

        throw new BadRequestError(errorMessages);
      }

      next();
    }
  ];
};

// Schémas de validation réutilisables
const nameSchema = body('name')
  .notEmpty()
  .withMessage('Le nom est requis')
  .isLength({ min: 3, max: 50 })
  .withMessage('Le nom doit contenir entre 3 et 50 caractères')
  .escape();

const emailSchema = body('email')
  .notEmpty()
  .withMessage("L'email est requis")
  .isEmail()
  .withMessage("Format d'email invalide")
  .escape();

const passwordSchema = body('password')
  .notEmpty()
  .withMessage('Le mot de passe est requis')
  .isLength({ min: 6 })
  .withMessage('Le mot de passe doit contenir au moins 6 caractères')
  .escape();

// Middleware de validation pour l'inscription
const validateRegisterInput = withValidationErrors([
  nameSchema,
  emailSchema,
  passwordSchema
]);

// Middleware de validation pour la connexion
const validateLoginInput = withValidationErrors([
  emailSchema,
  body('password')
    .notEmpty()
    .escape()
    .withMessage('Le mot de passe est requis')
    .custom(async (email) => {
      const {
        rows: [user]
      } = await db.query('SELECT * FROM users WHERE email = $1', [email]);

      if (user) {
        throw new BadRequestError("L'email existe déjà");
      }
    })
]);

// Middleware de validation pour le paramètre id
const validateIdParam = withValidationErrors([
  param('id')
    .escape()
    .custom(async (id) => {
      if (isNaN(Number(id))) {
        throw new BadRequestError('Identifiant invalide');
      }

      const {
        rows: [job]
      } = await db.query('SELECT * FROM jobs WHERE job_id = $1', [
        parseInt(id)
      ]);

      if (!job) {
        throw new NotFoundError(`Pas d'offre d'emploi avec l'id : ${id}`);
      }
    })
]);

// Middleware de validation pour l'offre d'emploi
const validateJobInput = withValidationErrors([
  body('company').notEmpty().withMessage('La compagnie est requise').escape(),
  body('position').notEmpty().withMessage('Le poste est requis').escape(),
  body('status')
    .escape()
    .isIn(Object.values(JOB_STATUS))
    .withMessage('Status invalide')
]);

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateIdParam,
  validateJobInput
};
