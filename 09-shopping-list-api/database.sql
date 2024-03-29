CREATE DATABASE grocery_database;

CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'user'
);

CREATE TABLE items(
  item_id SERIAL PRIMARY KEY,
  completed BOOLEAN DEFAULT false,
  name VARCHAR(255) NOT NULL,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);