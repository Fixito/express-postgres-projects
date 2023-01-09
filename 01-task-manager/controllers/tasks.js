const db = require('../db');

// créé une tâche
const createTask = async (req, res) => {
  try {
    const { name } = req.body;
    const newTask = await db.query('INSERT INTO task(name) VALUES($1)', [name]);
    res.status(201).json(newTask[0]);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// récupére toutes les tâches
const getAllTasks = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM task');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// récupére une tâche
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM task WHERE task_id = $1', [
      id
    ]);

    if (!rows[0]) {
      return res.status(404).json({ msg: `Pas de tâche avec l'id : ${id}` });
    }

    res.status(200).json({ task: rows[0] });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// modifie une tâche
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, completed } = req.body;
    const task = await db.query(
      'UPDATE task SET name = $1, completed = $2 WHERE task_id = $3',
      [name, completed, id]
    );

    if (task.rowCount === 0) {
      return res.status(404).json({ msg: `Pas de tâche avec l'id : ${id}` });
    }

    res.status(200).json({ task: { task_id: id, name, completed } });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// supprime une tâche
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await db.query('DELETE FROM task WHERE task_id = $1', [id]);

    if (task.rowCount === 0) {
      return res.status(404).json({ msg: `Pas de tâche avec l'id : ${id}` });
    }

    res.status(200).json({ msg: 'Tâche modifiée' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
};
