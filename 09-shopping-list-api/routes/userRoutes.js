const express = require('express');
const router = express.Router();
const {
  authenticateUser
} = require('../middlewares/authenticationMiddleware.js');

const { showCurrentUser } = require('../controllers/userController.js');

router.route('/showMe').get(authenticateUser, showCurrentUser);

module.exports = router;
