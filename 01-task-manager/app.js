const express = require('express');
const app = express();
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool();

app.use(express.static('./public'));
// middleware
app.use(express.json());

//* ROUTES

// créé une tâche
app.post('/api/v1/tasks', async (req, res) => {
  try {
    const { name } = req.body;
    const newTask = await pool.query('INSERT INTO task(name) VALUES($1)', [
      name
    ]);
    res.status(201).json(newTask[0]);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// récupére toutes les tâches
app.get('/api/v1/tasks', async (req, res) => {
  try {
    const tasks = await pool.query('SELECT * FROM task');
    res.status(200).json(tasks.rows);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// récupére une tâche
app.get('/api/v1/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await pool.query('SELECT * FROM task WHERE task_id = $1', [
      id
    ]);

    if (!task.rows[0]) {
      return res.status(404).json({ msg: `Pas de tâche avec l'id : ${id}` });
    }

    res.status(200).json({ task: task.rows[0] });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// modifie une tâche
app.patch('/api/v1/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, completed } = req.body;
    const task = await pool.query(
      'UPDATE task SET name = $1, completed = $2 WHERE task_id = $3',
      [name, completed, id]
    );

    if (!task.rowCount) {
      return res.status(404).json({ msg: `Pas de tâche avec l'id : ${id}` });
    }

    res.status(200).json({ task: { task_id: id, name, completed } });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// supprime une tâche
app.delete('/api/v1/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await pool.query('DELETE FROM task WHERE task_id = $1', [id]);

    if (!task.rowCount) {
      return res.status(404).json({ msg: `Pas de tâche avec l'id : ${id}` });
    }

    res.status(200).json({ task: id });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

app.listen(5000, () => {
  console.log(`Le serveur écoute sur le port 5000...`);
});
