# Database Scripts

This directory contains database migration scripts and seed data for the Coffee Shop Management system.

## Structure

```
scripts/database/
├── migrations/          # TypeORM migration files
│   └── 20251210180652-CreateCoffeeShopManagementSchema.ts
├── seeds/              # Seed data scripts
│   └── seed-coffee-shop-management.ts
├── run-migrations.ts   # TypeScript script to run migrations
├── run-migrations.ps1  # PowerShell script to run migrations
└── README.md          # This file
```

## Prerequisites

1. **PostgreSQL Database**: Ensure PostgreSQL is installed and running
2. **Node.js**: Node.js 16+ and npm
3. **Environment Variables**: Create `.env` file in project root with:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

## Installation

Install required npm packages:

```bash
npm install typeorm pg dotenv
npm install -D typescript ts-node @types/node
```

## Running Migrations

### Option 1: Using PowerShell Script (Recommended for Windows)

```powershell
.\scripts\database\run-migrations.ps1
```

### Option 2: Using TypeScript directly

```bash
npx ts-node scripts/database/run-migrations.ts
```

### Option 3: Using TypeORM CLI (if configured)

```bash
npx typeorm migration:run -d path/to/data-source.ts
```

## Running Seed Data

After migrations are complete, run seed data:

```bash
npx ts-node scripts/database/seeds/seed-coffee-shop-management.ts
```

## Migration Files

### 20251210180652-CreateCoffeeShopManagementSchema.ts

This migration creates all 18 tables for the Coffee Shop Management system:

1. `shop` - Shop information
2. `category` - Product categories
3. `product` - Products in menu
4. `product_image` - Product images
5. `product_option_group` - Product option groups
6. `product_option` - Product options
7. `area` - Areas in shop
8. `table` - Tables in shop
9. `employee` - Employees
10. `employee_permission` - Employee permissions
11. `table_reservation` - Table reservations
12. `order` - Orders
13. `order_item` - Order items
14. `payment` - Payments
15. `ingredient` - Ingredients
16. `product_ingredient` - Product recipes
17. `inventory_transaction` - Inventory transactions
18. `audit_log` - Audit logs

## Reverting Migrations

To revert the last migration:

```bash
npx typeorm migration:revert -d path/to/data-source.ts
```

## Checking Migration Status

To check which migrations have been run:

```sql
SELECT * FROM migrations ORDER BY timestamp DESC;
```

## Troubleshooting

### Error: Cannot find module 'typeorm'

Install dependencies:
```bash
npm install typeorm pg
```

### Error: Database connection failed

1. Check PostgreSQL is running
2. Verify `.env` file has correct credentials
3. Ensure database exists:
   ```sql
   CREATE DATABASE your_database_name;
   ```

### Error: Migration already executed

If a migration was partially executed, you may need to manually fix the database state or drop and recreate the database.

## Notes

- **Never use `synchronize: true` in production** - Always use migrations
- **Backup database** before running migrations in production
- **Test migrations** in development/staging before production
- **Review migration files** before executing

## Database Schema Documentation

See `docs_generated/database-engineer/` for detailed schema documentation:
- `schema-coffee-shop-management.md` - Complete schema documentation
- `erd-coffee-shop-management.md` - Entity Relationship Diagram

