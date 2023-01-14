CREATE DATABASE jobs_api;

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  CHECK (char_length(name) >= 3 AND char_length(name) <= 50),
  CHECK (char_length(password) >= 6),
  UNIQUE (email)
);

CREATE TABLE jobs(
  job_id SERIAL PRIMARY KEY,
  company VARCHAR(50) NOT NULL,
  position VARCHAR(100) NOT NULL,
  status VARCHAR(255) NOT NULL CHECK (company in ('entretien', 'refusé', 'en attente')) DEFAULT 'en attente',
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE RULE update_jobs AS ON UPDATE TO jobs DO UPDATE SET updated_at = NOW();