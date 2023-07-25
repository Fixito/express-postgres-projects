const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions
} = require('../middlewares/authenticationMiddleware.js');

const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

router.use(authenticateUser);
router
  .route('/')
  .get(authorizePermissions('admin'), getAllItems)
  .post(createItem);
router.route('/:id').get(getItem).patch(updateItem).delete(deleteItem);

module.exports = router;
