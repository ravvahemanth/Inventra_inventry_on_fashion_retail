-- Fashion Retail Database Setup Script
-- Run this script in MySQL to create the database

-- Create the fashion retail database
CREATE DATABASE IF NOT EXISTS fashion_retail_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE fashion_retail_db;

-- Grant privileges to root user (adjust as needed)
GRANT ALL PRIVILEGES ON fashion_retail_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- Display confirmation
SELECT 'Fashion Retail Database Created Successfully!' as Status;
SELECT DATABASE() as 'Current Database';