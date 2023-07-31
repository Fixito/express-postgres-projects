CREATE DATABASE task_manager;

CREATE TABLE tasks(
  task_id SERIAL PRIMARY KEY,
  completed BOOLEAN DEFAULT false,
  name VARCHAR(255) NOT NULL
);