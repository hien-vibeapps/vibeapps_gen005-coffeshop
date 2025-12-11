import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Verify migration results
 */
async function verifyMigration(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
    synchronize: false,
    logging: false,
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    } : false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database\n');

    // Check tables
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`📊 Found ${tables.length} tables:\n`);
    const expectedTables = [
      'shop', 'category', 'product', 'product_image', 'product_option_group', 'product_option',
      'area', 'table', 'employee', 'employee_permission', 'table_reservation',
      'order', 'order_item', 'payment',
      'ingredient', 'product_ingredient', 'inventory_transaction', 'audit_log', 'migrations'
    ];

    tables.forEach((table: any) => {
      const tableName = table.table_name;
      const isExpected = expectedTables.includes(tableName);
      const status = isExpected ? '✅' : '⚠️';
      console.log(`${status} ${tableName}`);
    });

    // Check migration record
    console.log('\n📝 Migration Records:');
    const migrations = await dataSource.query(`
      SELECT timestamp, name 
      FROM migrations 
      ORDER BY timestamp DESC;
    `);

    migrations.forEach((migration: any) => {
      console.log(`  ✅ ${migration.name} (${migration.timestamp})`);
    });

    // Check foreign keys
    console.log('\n🔗 Foreign Keys:');
    const foreignKeys = await dataSource.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name, kcu.column_name;
    `);

    console.log(`  Found ${foreignKeys.length} foreign keys`);

    // Check indexes
    console.log('\n📇 Indexes:');
    const indexes = await dataSource.query(`
      SELECT
        tablename,
        COUNT(*) as index_count
      FROM pg_indexes
      WHERE schemaname = 'public'
      GROUP BY tablename
      ORDER BY tablename;
    `);

    indexes.forEach((idx: any) => {
      console.log(`  ${idx.tablename}: ${idx.index_count} indexes`);
    });

    console.log('\n✅ Verification completed successfully!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying migration:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

verifyMigration();

