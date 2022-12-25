/* Replace with your SQL commands */
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) Not NULL,
  last_name VARCHAR(100) Not NULL,
  user_name VARCHAR(200) Not NULL UNIQUE,
  role user_role NOT NULL Default 'user',
  password VARCHAR(255) NOT NULL
);