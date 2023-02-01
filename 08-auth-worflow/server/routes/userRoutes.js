const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/authentication.js');

const { showCurrentUser } = require('../controllers/userController');

router.route('/showMe').get(authenticateUser, showCurrentUser);

module.exports = router;
