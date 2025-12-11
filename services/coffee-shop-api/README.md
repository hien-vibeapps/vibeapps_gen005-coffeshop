# Coffee Shop Management API

Backend API service for Coffee Shop Management System built with NestJS.

## Architecture

This service follows **Clean Architecture** pattern with the following layers:

- **Domain Layer**: Core business entities and repository interfaces
- **Application Layer**: DTOs and use cases
- **Infrastructure Layer**: TypeORM entities and repository implementations
- **Presentation Layer**: Controllers, services, and modules

## Features

- ✅ Shop Management
- ✅ Category Management
- ✅ Product Management (with images and options)
- ✅ Table & Area Management
- ✅ Employee Management
- ✅ Order Management
- ✅ Payment Processing
- ✅ Inventory Management
- ✅ Reports (Revenue, Sales, Inventory)

## API Endpoints

### Shops
- `GET /api/v1/shops/:id` - Get shop by ID
- `PUT /api/v1/shops/:id` - Update shop

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `POST /api/v1/categories` - Create category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Tables
- `GET /api/v1/areas` - Get all areas
- `GET /api/v1/areas/:id` - Get area by ID
- `POST /api/v1/areas` - Create area
- `PUT /api/v1/areas/:id` - Update area
- `DELETE /api/v1/areas/:id` - Delete area
- `GET /api/v1/tables` - Get all tables
- `GET /api/v1/tables/:id` - Get table by ID
- `POST /api/v1/tables` - Create table
- `PUT /api/v1/tables/:id` - Update table
- `DELETE /api/v1/tables/:id` - Delete table

### Employees
- `GET /api/v1/employees` - Get all employees
- `GET /api/v1/employees/:id` - Get employee by ID
- `POST /api/v1/employees` - Create employee
- `PUT /api/v1/employees/:id` - Update employee
- `DELETE /api/v1/employees/:id` - Delete employee

### Orders
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/:id` - Update order
- `POST /api/v1/orders/:id/cancel` - Cancel order
- `PATCH /api/v1/orders/:id/status` - Update order status

### Payments
- `GET /api/v1/payments` - Get all payments
- `GET /api/v1/payments/:id` - Get payment by ID
- `POST /api/v1/payments` - Create payment

### Inventory
- `GET /api/v1/ingredients` - Get all ingredients
- `GET /api/v1/ingredients/:id` - Get ingredient by ID
- `POST /api/v1/ingredients` - Create ingredient
- `PUT /api/v1/ingredients/:id` - Update ingredient
- `DELETE /api/v1/ingredients/:id` - Delete ingredient

### Reports
- `GET /api/v1/reports/revenue` - Get revenue report
- `GET /api/v1/reports/sales` - Get sales report
- `GET /api/v1/reports/inventory` - Get inventory report

## Swagger Documentation

API documentation is available at: `http://localhost:9001/api/docs`

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_shop
DB_USERNAME=postgres
DB_PASSWORD=postgres

# Backend API Configuration
BACKEND_PORT=9001
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:9000
```

## Installation

```bash
cd services/coffee-shop-api
npm install
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Database

The service uses PostgreSQL with TypeORM. Make sure the database is running and migrations are executed before starting the service.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

