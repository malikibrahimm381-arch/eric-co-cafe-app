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
  status ENUM('open', 'paid', 'cancelled') NOT NULL DEFAULT 'open',
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

INSERT INTO users (id, name, username, password_hash, role) VALUES
  (1, 'Admin Cafe', 'admin', '$2b$10$jdmKwkBoDAi498UewtrHUe5SxjcF1mIa/.mx8gltC5c29yuYR00ha', 'admin'),
  (2, 'Kasir Cafe', 'kasir', '$2b$10$ZUAAxA8pWiUSjQNEvlQtHuHQMc447ZmRRyn9BUf87hQd0BwG0QOQa', 'cashier'),
  (3, 'Developer', 'developer', '$2b$10$S/aWkORKUnXUWlNacZXe7Oe.5uvlR1WCD6bv07HLzDZGE0SPid3fG', 'developer')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role);

INSERT INTO menu_items (id, name, category, price, thumbnail, description, is_active) VALUES
  (1, 'Chicken Katsu', 'Makanan', 35000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFQztr0w0a1Vh1Qwia3bkJVp2FR_D1wq-0zA&s', 'Chicken katsu crispy', 1),
  (2, 'Croissant', 'Makanan', 22000, 'https://asset.kompas.com/crops/QzJ7mkzUuw8Xo1yZf0gpBGxUuAI=/15x9:895x596/1200x800/data/photo/2023/02/01/63d9fbce5a2d2.jpg', 'Croissant Prancis', 1),
  (3, 'French Fries', 'Makanan', 20000, 'https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=960&h=960&q=82&fm=jpg&fit=crop&dm=1662474181&s=50bccc38a736ef0e0a6e261ad23378f4', 'Kentang goreng renyah', 1),
  (4, 'Mie Goreng', 'Makanan', 25000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQECDWd5uz2t0QErli92w2apL9JcLU9U-ZlmA&s', 'Mie goreng dengan telur', 1),
  (5, 'Nasi Goreng', 'Makanan', 30000, 'https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2025/03/11082616/5-Resep-Nasi-Goreng-Sederhana-hingga-Spesial-Mudah-dan-Praktis.jpg', 'Nasi goreng spesial', 1),
  (6, 'Spaghetti Bolognese', 'Makanan', 32000, 'https://www.preciouscore.com/wp-content/uploads/2024/06/Spaghetti-Bolognese-Chicken.jpg', 'Spaghetti dengan saus daging', 1),
  (7, 'Cafe Latte', 'Minuman', 25000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbeTrexIYpCCSK6QSKlS283rUBtdQ7hpjIw&s', 'Espresso dengan susu steamed', 1),
  (8, 'Espresso', 'Minuman', 15000, 'https://islandsunindonesia.com/wp-content/uploads/2022/01/espresso.jpg', 'Espresso murni', 1),
  (9, 'Jus Jeruk', 'Minuman', 18000, 'https://rri-portal-app-assets.obs.ap-southeast-4.myhuaweicloud.com/upload/berita/image/bukittinggi/1777464925702232_8da3810820_berita_bukittinggi.webp', 'Jus jeruk segar', 1),
  (10, 'Kopi Hitam', 'Minuman', 15000, 'https://awsimages.detik.net.id/community/media/visual/2022/11/15/sama-sama-kopi-hitam-apa-bedanya-americano-long-black-dan-kopi-tubruk_169.jpeg?w=600&q=90', 'Kopi hitam pilihan', 1),
  (11, 'Mango Smoothie', 'Minuman', 26000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKslKWi8UpfQ5JgRvXS9Nx6-oxvsOuGckjJg&s', 'Smoothie mangga segar', 1),
  (12, 'Matcha Latte', 'Minuman', 28000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTQdGZiR3vS7PS4CxexJkZ_sGJvCC349BRzw&s', 'Matcha asli Jepang', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  price = VALUES(price),
  thumbnail = VALUES(thumbnail),
  description = VALUES(description),
  is_active = VALUES(is_active);
