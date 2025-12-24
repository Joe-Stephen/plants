# PlantStore E-Commerce

A full-stack e-commerce application for selling plants, built with Node.js, Express, TypeScript, and React.

## Features
- **Authentication**: Secure Login/Signup with JWT.
- **Catalog**: Browse products, categories, search, and filter.
- **Cart**: Persistent cart for users, guest cart support.
- **Checkout**: Address management and Razorpay payment integration.
- **Admin**: Dashboard for managing orders and products (API).

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, Sequelize (MySQL/Postgres)
- **Frontend**: React, Vite, Tailwind CSS, Redux Toolkit
- **Payment**: Razorpay
- **Storage**: Cloudinary (Images)

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MySQL or PostgreSQL Database

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Configure Environment
cp .env.example .env
# Edit .env with your DB credentials and Keys

# Database Setup
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# Run Development Server
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Architecture

### Database Schema
- **Users**: `id, name, email, password, role`
- **Products**: `id, name, price, stock, categoryId`
- **Orders**: `id, userId, total, status, razorpayOrderId`
- **OrderItems**: `id, orderId, productId, quantity, price`

### API Overview
- `POST /auth/login` - User login
- `GET /products` - List products
- `POST /cart` - Add item to cart
- `POST /orders` - Create order
- `POST /orders/verify` - Verify Razorpay payment

## Production
See `CHECKLIST.md` for deployment steps.
