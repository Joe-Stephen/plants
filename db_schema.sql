-- Database Schema for Plants E-commerce
-- Compatible with MySQL and TiDB

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id)
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parentId INTEGER,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (parentId) REFERENCES Categories(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS Products (
    id INTEGER NOT NULL AUTO_INCREMENT,
    categoryId INTEGER,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 4. ProductImages Table
CREATE TABLE IF NOT EXISTS ProductImages (
    id INTEGER NOT NULL AUTO_INCREMENT,
    productId INTEGER NOT NULL,
    url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Addresses Table
CREATE TABLE IF NOT EXISTS Addresses (
    id INTEGER NOT NULL AUTO_INCREMENT,
    userId INTEGER NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Carts Table
CREATE TABLE IF NOT EXISTS Carts (
    id INTEGER NOT NULL AUTO_INCREMENT,
    userId INTEGER,
    sessionId VARCHAR(255) UNIQUE,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. CartItems Table
CREATE TABLE IF NOT EXISTS CartItems (
    id INTEGER NOT NULL AUTO_INCREMENT,
    cartId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (cartId) REFERENCES Carts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER NOT NULL AUTO_INCREMENT,
    userId INTEGER NOT NULL,
    addressId INTEGER,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    razorpayOrderId VARCHAR(255),
    razorpayPaymentId VARCHAR(255),
    shippingCost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    estimatedDeliveryDate DATETIME,
    deliveryPartner VARCHAR(255),
    shiprocketOrderId VARCHAR(255),
    shiprocketShipmentId VARCHAR(255),
    awbCode VARCHAR(255),
    courierId VARCHAR(255),
    pickupPincode VARCHAR(255),
    deliveryPincode VARCHAR(255),
    trackingUrl VARCHAR(255),
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (addressId) REFERENCES Addresses(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 9. OrderItems Table
CREATE TABLE IF NOT EXISTS OrderItems (
    id INTEGER NOT NULL AUTO_INCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 10. AnalyticsDailySummaries Table
CREATE TABLE IF NOT EXISTS AnalyticsDailySummaries (
    id INTEGER NOT NULL AUTO_INCREMENT,
    date DATE NOT NULL UNIQUE,
    totalRevenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
    totalOrders INTEGER NOT NULL DEFAULT 0,
    totalItemsSold INTEGER NOT NULL DEFAULT 0,
    newUsers INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE INDEX idx_analytics_date ON AnalyticsDailySummaries(date);
