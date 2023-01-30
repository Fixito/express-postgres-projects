CREATE DATABASE auth_workflow;

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 50),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL CHECK (char_length(password) >= 6),
  role VARCHAR(255) NOT NULL CHECK (role in ('admin', 'user')) DEFAULT 'user',
  verificationToken VARCHAR(255),
  isVerified BOOLEAN DEFAULT false,
  verified TIMESTAMP WITH TIME ZONE,
  password_token VARCHAR(255),
  password_token_expiration_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE tokens(
  token_id SERIAL PRIMARY KEY,
  ip VARCHAR(255) NOT NULL,
  userAgent VARCHAR(255) NOT NULL,
  isValid BOOLEAN DEFAULT false,
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