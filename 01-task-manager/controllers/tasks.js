const db = require('../db');
const { createCustomError } = require('../errors/customError');
const asyncWrapper = require('../middleware/async');

// crée une tâche
const createTask = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  const { rows } = await db.query(
    'INSERT INTO task(name) VALUES($1) RETURNING *',
    [name]
  );
  res.status(201).json({ task: rows[0] });
});

// récupère toutes les tâches
const getAllTasks = asyncWrapper(async (_, res) => {
  const { rows } = await db.query('SELECT * FROM task');
  res.status(200).json(rows);
});

// récupère une tâche
const getTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { rows } = await db.query('SELECT * FROM task WHERE task_id = $1', [
    id
  ]);

  if (!rows[0]) {
    // const error = new Error('pas trouvé');
    // error.status = 404;
    // return next(error);

    return next(createCustomError(`Pas de tâche avec l'id : ${id}`, 404));
  }

  res.status(200).json({ task: rows[0] });
});

// modifie une tâche
const updateTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name, completed } = req.body;
  const { rows } = await db.query(
    'UPDATE task SET name = $1, completed = $2 WHERE task_id = $3 RETURNING *',
    [name, completed, id]
  );

  if (!rows[0]) {
    return next(createCustomError(`Pas de tâche avec l'id : ${id}`, 404));
  }

  res.status(200).json({ task: rows[0] });
});

// supprime une tâche
const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { rows } = await db.query(
    'DELETE FROM task WHERE task_id = $1 RETURNING *',
    [id]
  );
  console.log(rows[0]);

  if (!rows[0]) {
    return next(createCustomError(`Pas de tâche avec l'id : ${id}`, 404));
  }

  res.status(200).json({ task: rows[0] });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
};
