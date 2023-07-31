const db = require('../db');
const { createCustomError } = require('../errors/customError');
const asyncWrapper = require('../middleware/async');

// crée une tâche
const createTask = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  const {
    rows: [task]
  } = await db.query('INSERT INTO tasks(name) VALUES($1) RETURNING *', [name]);
  res.status(201).json({ task });
});

// récupère toutes les tâches
const getAllTasks = asyncWrapper(async (_, res) => {
  const { rows: tasks } = await db.query('SELECT * FROM tasks');
  res.status(200).json({ tasks });
});

// récupère une tâche
const getTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const {
    rows: [task]
  } = await db.query('SELECT * FROM tasks WHERE task_id = $1', [id]);

  if (!task) {
    // const error = new Error('pas trouvé');
    // error.status = 404;
    // return next(error);

    return next(createCustomError(`Pas de tâche avec l'id : ${id}`, 404));
  }

  res.status(200).json({ task });
});

// modifie une tâche
const updateTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name, completed } = req.body;

  const {
    rows: [updatedTask]
  } = await db.query(
    'UPDATE tasks SET name = $1, completed = $2 WHERE task_id = $3 RETURNING *',
    [name, completed, id]
  );

  if (!updatedTask) {
    return next(createCustomError(`Pas de tâche avec l'id : ${id}`, 404));
  }

  res.status(200).json({ task: updatedTask });
});

// supprime une tâche
const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const {
    rows: [deletedTask]
  } = await db.query('DELETE FROM tasks WHERE task_id = $1 RETURNING *', [id]);

  if (!deletedTask) {
    return next(createCustomError(`Pas de tâche avec l'id : ${id}`, 404));
  }

  res.status(200).json({ task: deletedTask });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
};
