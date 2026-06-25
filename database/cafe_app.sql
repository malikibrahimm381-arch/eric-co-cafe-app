CREATE DATABASE IF NOT EXISTS cafe_soft_pos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cafe_soft_pos;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('cashier', 'admin', 'developer') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  thumbnail VARCHAR(600) NOT NULL,
  description TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE menu_items
  MODIFY thumbnail VARCHAR(600) NOT NULL;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_type ENUM('dine_in', 'take_away') NOT NULL DEFAULT 'dine_in',
  table_number VARCHAR(30) NULL,
  customer_name VARCHAR(120) NOT NULL DEFAULT 'Customer',
  source ENUM('qr', 'cashier') NOT NULL DEFAULT 'qr',
  status ENUM('open', 'processing', 'ready', 'paid', 'cancelled') NOT NULL DEFAULT 'open',
  subtotal DECIMAL(12, 2) NOT NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NULL,
  menu_name VARCHAR(150) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_order_items_menu
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  method ENUM('cash', 'cashless') NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  paid_amount DECIMAL(12, 2) NOT NULL,
  change_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  cashier_id INT NULL,
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_payments_cashier
    FOREIGN KEY (cashier_id) REFERENCES users(id)
    ON DELETE SET NULL
);

ALTER TABLE orders
  MODIFY status ENUM('open', 'processing', 'ready', 'paid', 'cancelled') NOT NULL DEFAULT 'open';

INSERT INTO users (id, name, username, password_hash, role) VALUES
  (1, 'Admin Cafe', 'admin', '$2b$10$jdmKwkBoDAi498UewtrHUe5SxjcF1mIa/.mx8gltC5c29yuYR00ha', 'admin'),
  (2, 'Kasir Cafe', 'kasir', '$2b$10$ZUAAxA8pWiUSjQNEvlQtHuHQMc447ZmRRyn9BUf87hQd0BwG0QOQa', 'cashier'),
  (3, 'Developer', 'developer', '$2b$10$S/aWkORKUnXUWlNacZXe7Oe.5uvlR1WCD6bv07HLzDZGE0SPid3fG', 'developer')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role);

INSERT INTO menu_items (id, name, category, price, thumbnail, description, is_active) VALUES
  (1, 'Americano', 'Minuman', 26000, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', 'Kopi hitam espresso dengan karakter bersih', 1),
  (2, 'Cappuccino', 'Minuman', 25000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80', 'Espresso, steamed milk, dan foam lembut', 1),
  (3, 'Caramel Macchiato', 'Minuman', 28000, 'https://images.unsplash.com/photo-1587985782608-20062892559d?auto=format&fit=crop&w=800&q=80', 'Kopi susu dengan sentuhan karamel', 1),
  (4, 'Latte', 'Minuman', 23000, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80', 'Latte klasik creamy untuk teman kerja', 1),
  (5, 'Chicken Katsu', 'Makanan', 35000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFQztr0w0a1Vh1Qwia3bkJVp2FR_D1wq-0zA&s', 'Chicken katsu crispy dengan salad segar', 1),
  (6, 'Beef Burger', 'Makanan', 40000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ3rzkU-v0XnFfQYRfHzBMZe6HDAe3e0NNjw&s', 'Burger sapi juicy dengan saus signature', 1),
  (7, 'French Fries', 'Snack', 23000, 'https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=960&h=960&q=82&fm=jpg&fit=crop&dm=1662474181&s=50bccc38a736ef0e0a6e261ad23378f4', 'Kentang goreng renyah dengan saus pilihan', 1),
  (8, 'Cheesecake', 'Dessert', 30000, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80', 'Cheesecake lembut dengan base buttery', 1),
  (9, 'Matcha Latte', 'Minuman', 27000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTQdGZiR3vS7PS4CxexJkZ_sGJvCC349BRzw&s', 'Matcha latte earthy dan creamy', 1),
  (10, 'Lemon Tea', 'Minuman', 18000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80', 'Teh lemon segar dingin atau hangat', 1),
  (11, 'Chocolate Cake', 'Dessert', 25000, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', 'Cake coklat rich dan lembap', 1),
  (12, 'Red Velvet', 'Dessert', 32000, 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80', 'Red velvet slice dengan cream cheese', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  price = VALUES(price),
  thumbnail = VALUES(thumbnail),
  description = VALUES(description),
  is_active = VALUES(is_active);
