const express = require('express');
const router = express.Router();

const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/tasks');

router.route('/').get(getAllTasks).post(createTask);
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);

// PUT - remplace la ressource existante
// PATCH - mis à jour partielle

module.exports = router;
