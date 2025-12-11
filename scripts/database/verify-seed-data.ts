import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Verify seed data
 */
async function verifySeedData(): Promise<void> {
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

    // Check Shop
    const shops = await dataSource.query(`SELECT id, name, email, is_active FROM shop;`);
    console.log(`🏪 Shops: ${shops.length}`);
    shops.forEach((shop: any) => {
      console.log(`  - ${shop.name} (${shop.email}) - ${shop.is_active ? 'Active' : 'Inactive'}`);
    });

    // Check Categories
    const categories = await dataSource.query(`SELECT COUNT(*) as count FROM category;`);
    console.log(`\n📁 Categories: ${categories[0].count}`);

    // Check Products
    const products = await dataSource.query(`SELECT COUNT(*) as count FROM product;`);
    console.log(`\n☕ Products: ${products[0].count}`);

    // Check Areas
    const areas = await dataSource.query(`SELECT COUNT(*) as count FROM area;`);
    console.log(`\n📍 Areas: ${areas[0].count}`);

    // Check Tables
    const tables = await dataSource.query(`SELECT COUNT(*) as count FROM "table";`);
    console.log(`\n🪑 Tables: ${tables[0].count}`);

    // Check Employees
    const employees = await dataSource.query(`
      SELECT e.full_name, e.role, e.email 
      FROM employee e 
      ORDER BY e.role;
    `);
    console.log(`\n👥 Employees: ${employees.length}`);
    employees.forEach((emp: any) => {
      console.log(`  - ${emp.full_name} (${emp.role}) - ${emp.email}`);
    });

    // Check Ingredients
    const ingredients = await dataSource.query(`SELECT COUNT(*) as count FROM ingredient;`);
    console.log(`\n🥛 Ingredients: ${ingredients[0].count}`);

    // Check Product Ingredients (Recipes)
    const recipes = await dataSource.query(`SELECT COUNT(*) as count FROM product_ingredient;`);
    console.log(`\n📝 Product Recipes: ${recipes[0].count}`);

    // Check Inventory Transactions
    const transactions = await dataSource.query(`SELECT COUNT(*) as count FROM inventory_transaction;`);
    console.log(`\n📦 Inventory Transactions: ${transactions[0].count}`);

    // Show some sample products with categories
    console.log(`\n📋 Sample Products:`);
    const sampleProducts = await dataSource.query(`
      SELECT p.name, c.name as category, p.price, p.status
      FROM product p
      JOIN category c ON p.category_id = c.id
      ORDER BY c.display_order, p.display_order
      LIMIT 10;
    `);
    sampleProducts.forEach((prod: any) => {
      console.log(`  - ${prod.name} (${prod.category}) - ${prod.price.toLocaleString('vi-VN')} VND - ${prod.status}`);
    });

    // Show tables with areas
    console.log(`\n🪑 Tables by Area:`);
    const tablesByArea = await dataSource.query(`
      SELECT t.table_number, a.name as area, t.capacity, t.status
      FROM "table" t
      JOIN area a ON t.area_id = a.id
      ORDER BY a.name, t.table_number;
    `);
    tablesByArea.forEach((table: any) => {
      console.log(`  - ${table.table_number} (${table.area}) - Capacity: ${table.capacity} - Status: ${table.status}`);
    });

    console.log('\n✅ Seed data verification completed successfully!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying seed data:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

verifySeedData();



