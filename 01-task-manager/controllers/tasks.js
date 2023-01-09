const db = require('../db');
const { createCustomError } = require('../errors/customError');
const asyncWrapper = require('../middleware/async');

// créé une tâche
const createTask = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  const newTask = await db.query('INSERT INTO task(name) VALUES($1)', [name]);
  res.status(201).json(newTask[0]);
});

// récupére toutes les tâches
const getAllTasks = asyncWrapper(async (_, res) => {
  const { rows } = await db.query('SELECt * FROM task');
  res.status(200).json(rows);
});

// récupére une tâche
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
  const task = await db.query(
    'UPDATE task SET name = $1, completed = $2 WHERE task_id = $3',
    [name, completed, id]
  );

  if (task.rowCount === 0) {
    return next(createCustomError(`Pas de tâche avec l'id : ${id}`, 404));
  }

  res.status(200).json({ task: { task_id: id, name, completed } });
});

// supprime une tâche
const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const task = await db.query('DELETE FROM task WHERE task_id = $1', [id]);

  if (task.rowCount === 0) {
    return next(createCustomError(`Pas de tâche avec l'id : ${id}`, 404));
  }

  res.status(200).json({ msg: 'Tâche modifiée' });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
};
