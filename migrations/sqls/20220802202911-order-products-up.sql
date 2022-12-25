/* Replace with your SQL commands */
CREATE TABLE order_products(
  id SERIAL PRIMARY KEY,
  quantity INTEGER Not NULL,
  product_id BIGINT REFERENCES products(id) Not NULL,
  order_id BIGINT REFERENCES orders(id) Not NULL
);