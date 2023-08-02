const express = require('express');
const router = express.Router();

const {
  validateRegisterInput,
  validateLoginInput
} = require('../middleware/validationMiddleware.js');

const { login, register } = require('../controllers/auth');

router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);

module.exports = router;
