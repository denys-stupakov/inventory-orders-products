-- Orders & Products SPA — Database Schema
-- Can be imported into MySQL Workbench
-- Note: this project uses in-memory storage (server/index.js);
-- this file documents the intended relational schema.

CREATE DATABASE IF NOT EXISTS inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventory_db;

CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  name        VARCHAR(255) NOT NULL,
  password    VARCHAR(255) NOT NULL,  -- bcrypt hash
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  date        DATETIME NOT NULL,
  description TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  serial_number  BIGINT NOT NULL,
  is_new         TINYINT(1) NOT NULL DEFAULT 1,
  photo          VARCHAR(500),
  title          VARCHAR(255) NOT NULL,
  type           VARCHAR(100) NOT NULL,
  specification  VARCHAR(255),
  guarantee_start DATETIME NOT NULL,
  guarantee_end   DATETIME NOT NULL,
  order_id       INT,
  date           DATETIME NOT NULL,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

CREATE TABLE product_prices (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  product_id  INT NOT NULL,
  value       DECIMAL(10,2) NOT NULL,
  symbol      VARCHAR(10) NOT NULL,  -- 'USD', 'UAH'
  is_default  TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Sessions are tracked in-memory via Socket.io (not persisted)
