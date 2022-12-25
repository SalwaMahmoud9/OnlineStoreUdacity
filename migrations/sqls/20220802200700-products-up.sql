/* Replace with your SQL commands */
CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) Not NULL UNIQUE,
  price NUMERIC Not NULL,
  category VARCHAR(255) DEFAULT ''
);