-- Production MySQL Database Schema for Tirupati Restaurant 3-Tier Architecture
-- Suitable for deployment on AWS RDS, Azure Database for MySQL, or GCP Cloud SQL

CREATE DATABASE IF NOT EXISTS tirupati_restaurant_db;
USE tirupati_restaurant_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin', 'chef', 'manager') DEFAULT 'customer',
  dob DATE NULL,
  gender VARCHAR(20) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. OTP Verification Logs Table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mobile VARCHAR(15) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  verified TINYINT(1) DEFAULT 0,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0
);

-- 4. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  offer_price DECIMAL(10,2) DEFAULT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_veg TINYINT(1) DEFAULT 1,
  is_daily_special TINYINT(1) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 4.8,
  total_ratings INT DEFAULT 120,
  ingredients TEXT,
  allergens VARCHAR(255),
  calories INT,
  preparation_style VARCHAR(255),
  worship_significance TEXT DEFAULT NULL,
  available TINYINT(1) DEFAULT 1,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 5. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_item_id INT NOT NULL,
  user_id INT NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  image_url VARCHAR(500) DEFAULT NULL,
  likes_count INT DEFAULT 0,
  status ENUM('approved', 'pending', 'rejected') DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(30) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  house_no VARCHAR(100) NOT NULL,
  street VARCHAR(150) NOT NULL,
  area VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  pin_code VARCHAR(10) NOT NULL,
  landmark VARCHAR(150),
  primary_mobile VARCHAR(15) NOT NULL,
  secondary_mobile VARCHAR(15) NOT NULL,
  delivery_instructions TEXT,
  distance_km DECIMAL(5,2) NOT NULL,
  item_total DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  grand_total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'Completed',
  order_status ENUM('Order Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Order Confirmed',
  estimated_delivery_time VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 9. Table Reservations Table
CREATE TABLE IF NOT EXISTS table_reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_code VARCHAR(20) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_mobile VARCHAR(15) NOT NULL,
  res_date DATE NOT NULL,
  res_time VARCHAR(20) NOT NULL,
  guests INT NOT NULL,
  seating_preference ENUM('Indoor', 'Outdoor') DEFAULT 'Indoor',
  special_occasion VARCHAR(100),
  status ENUM('Confirmed', 'Completed', 'Cancelled') DEFAULT 'Confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Customer Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT DEFAULT NULL,
  user_id INT NOT NULL,
  food_quality INT CHECK(food_quality BETWEEN 1 AND 5),
  taste INT CHECK(taste BETWEEN 1 AND 5),
  hygiene INT CHECK(hygiene BETWEEN 1 AND 5),
  delivery INT CHECK(delivery BETWEEN 1 AND 5),
  service INT CHECK(service BETWEEN 1 AND 5),
  overall INT CHECK(overall BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  discount_percent INT NOT NULL,
  max_discount DECIMAL(10,2) NOT NULL,
  min_order DECIMAL(10,2) NOT NULL,
  active TINYINT(1) DEFAULT 1
);
