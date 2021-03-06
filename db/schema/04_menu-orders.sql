DROP TABLE IF EXISTS menu_orders CASCADE;

CREATE TABLE menu_orders (
  id SERIAL PRIMARY KEY NOT NULL,
  menu_id INTEGER REFERENCES menu(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  quantity INT,
  order_status SMALLINT DEFAULT 0
);

-- comment
