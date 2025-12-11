import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { CreateCoffeeShopManagementSchema20251210180652 } from './migrations/20251210180652-CreateCoffeeShopManagementSchema';

// Load environment variables
dotenv.config();

/**
 * Run database migrations
 * This script executes all pending migrations
 */
async function runMigrations(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
    migrations: [CreateCoffeeShopManagementSchema20251210180652],
    migrationsTableName: 'migrations',
    synchronize: false, // Never use synchronize in production
    logging: true,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    } : false,
  });

  try {
    console.log('🔄 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected to database');

    console.log('🔄 Running migrations...');
    await dataSource.runMigrations();
    console.log('✅ All migrations completed successfully!');

    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

// Run migrations
runMigrations();

