CREATE DATABASE auth_workflow;

CREATE TABLE roles(
  role_id SERIAL PRIMARY KEY,
  role VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 50),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL CHECK (char_length(password) >= 6),
  role_id INTEGER REFERENCES roles(role_id) ON DELETE CASCADE NOT NULL,
  verification_token VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  verified TIMESTAMP WITH TIME ZONE,
  password_token VARCHAR(255),
  password_token_expiration_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE tokens(
  token_id SERIAL PRIMARY KEY,
  refresh_token VARCHAR(255) NOT NULL,
  ip VARCHAR(255) NOT NULL,
  user_agent VARCHAR(255) NOT NULL,
  is_valid BOOLEAN DEFAULT true,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tokens
BEFORE UPDATE ON tokens
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();