import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Seed data for Coffee Shop Management
 * This script creates sample data for testing and development
 */
export async function seedCoffeeShopManagement(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    await queryRunner.startTransaction();

    // 1. Create Shop
    const shopResult = await queryRunner.query(`
      INSERT INTO shop (
        name, address, phone, email, logo_url, opening_time, closing_time,
        description, currency, timezone, vat_rate, service_fee_rate, is_active
      ) VALUES (
        'Coffee House Central',
        '123 Nguyễn Huệ, Quận 1, TP.HCM',
        '0901234567',
        'info@coffeehousecentral.com',
        'https://example.com/logo.png',
        '07:00:00',
        '22:00:00',
        'Quán cà phê hiện đại với không gian ấm cúng',
        'VND',
        'Asia/Ho_Chi_Minh',
        10.00,
        5.00,
        true
      )
      RETURNING id;
    `);
    const shopId = shopResult[0].id;

    // 2. Create Categories
    const categories = await queryRunner.query(`
      INSERT INTO category (shop_id, name, description, display_order, is_active)
      VALUES
        ($1, 'Đồ uống nóng', 'Cà phê, trà, chocolate nóng', 1, true),
        ($1, 'Đồ uống lạnh', 'Cà phê đá, sinh tố, nước ép', 2, true),
        ($1, 'Bánh ngọt', 'Bánh kem, bánh mì, bánh quy', 3, true),
        ($1, 'Đồ ăn nhẹ', 'Sandwich, salad, pasta', 4, true)
      RETURNING id, name;
    `, [shopId]);

    const categoryMap: Record<string, string> = {};
    categories.forEach((cat: any) => {
      categoryMap[cat.name] = cat.id;
    });

    // 3. Create Products
    const products = await queryRunner.query(`
      INSERT INTO product (
        shop_id, category_id, name, description, price, estimated_prep_time,
        status, calories, display_order, is_active
      )
      VALUES
        ($1, $2, 'Cà phê đen', 'Cà phê đen đậm đà', 25000, 3, 'available', 5, 1, true),
        ($1, $2, 'Cà phê sữa', 'Cà phê sữa đặc biệt', 30000, 3, 'available', 120, 2, true),
        ($1, $2, 'Cappuccino', 'Cappuccino với bọt sữa', 45000, 5, 'available', 150, 3, true),
        ($1, $2, 'Latte', 'Latte với sữa tươi', 50000, 5, 'available', 180, 4, true),
        ($1, $3, 'Cà phê đá', 'Cà phê đá mát lạnh', 30000, 2, 'available', 5, 1, true),
        ($1, $3, 'Sinh tố dâu', 'Sinh tố dâu tươi', 55000, 5, 'available', 200, 2, true),
        ($1, $3, 'Nước ép cam', 'Nước ép cam tươi', 45000, 3, 'available', 120, 3, true),
        ($1, $4, 'Bánh kem socola', 'Bánh kem socola ngọt ngào', 35000, 0, 'available', 350, 1, true),
        ($1, $4, 'Bánh mì sandwich', 'Bánh mì sandwich thịt nguội', 45000, 5, 'available', 280, 2, true),
        ($1, $5, 'Salad rau củ', 'Salad rau củ tươi ngon', 60000, 5, 'available', 150, 1, true),
        ($1, $5, 'Pasta carbonara', 'Pasta carbonara đậm đà', 85000, 10, 'available', 450, 2, true)
      RETURNING id, name;
    `, [shopId, categoryMap['Đồ uống nóng'], categoryMap['Đồ uống lạnh'], categoryMap['Bánh ngọt'], categoryMap['Đồ ăn nhẹ']]);

    const productMap: Record<string, string> = {};
    products.forEach((prod: any) => {
      productMap[prod.name] = prod.id;
    });

    // 4. Create Product Images
    await queryRunner.query(`
      INSERT INTO product_image (product_id, image_url, display_order, is_primary)
      VALUES
        ($1, 'https://example.com/cafe-den.jpg', 1, true),
        ($2, 'https://example.com/cafe-sua.jpg', 1, true),
        ($3, 'https://example.com/cappuccino.jpg', 1, true),
        ($4, 'https://example.com/latte.jpg', 1, true)
    `, [productMap['Cà phê đen'], productMap['Cà phê sữa'], productMap['Cappuccino'], productMap['Latte']]);

    // 5. Create Product Option Groups and Options
    const sizeGroupResult = await queryRunner.query(`
      INSERT INTO product_option_group (product_id, name, is_required, max_selections, display_order)
      VALUES ($1, 'Size', true, 1, 1)
      RETURNING id;
    `, [productMap['Cappuccino']]);
    const sizeGroupId = sizeGroupResult[0].id;

    await queryRunner.query(`
      INSERT INTO product_option (option_group_id, name, price_adjustment, display_order, is_active)
      VALUES
        ($1, 'Small', 0, 1, true),
        ($1, 'Medium', 10000, 2, true),
        ($1, 'Large', 20000, 3, true)
    `, [sizeGroupId]);

    // 6. Create Areas
    const areas = await queryRunner.query(`
      INSERT INTO area (shop_id, name, description, is_active)
      VALUES
        ($1, 'Tầng 1', 'Khu vực tầng 1', true),
        ($1, 'Tầng 2', 'Khu vực tầng 2', true),
        ($1, 'Sân vườn', 'Khu vực sân vườn ngoài trời', true)
      RETURNING id, name;
    `, [shopId]);

    const areaMap: Record<string, string> = {};
    areas.forEach((area: any) => {
      areaMap[area.name] = area.id;
    });

    // 7. Create Tables
    await queryRunner.query(`
      INSERT INTO "table" (area_id, table_number, capacity, status, position_x, position_y, is_active)
      VALUES
        ($1, 'T1-01', 4, 'available', 10.5, 20.3, true),
        ($1, 'T1-02', 4, 'available', 15.5, 20.3, true),
        ($1, 'T1-03', 6, 'available', 20.5, 20.3, true),
        ($2, 'T2-01', 4, 'available', 10.5, 20.3, true),
        ($2, 'T2-02', 4, 'available', 15.5, 20.3, true),
        ($3, 'SV-01', 8, 'available', 5.5, 10.3, true),
        ($3, 'SV-02', 8, 'available', 10.5, 10.3, true)
    `, [areaMap['Tầng 1'], areaMap['Tầng 2'], areaMap['Sân vườn']]);

    // 8. Create Employees
    const employees = await queryRunner.query(`
      INSERT INTO employee (
        shop_id, email, phone, full_name, role, start_date, is_active
      )
      VALUES
        ($1, 'owner@coffeehousecentral.com', '0901111111', 'Nguyễn Văn A', 'owner', CURRENT_DATE, true),
        ($1, 'manager@coffeehousecentral.com', '0902222222', 'Trần Thị B', 'manager', CURRENT_DATE, true),
        ($1, 'waiter1@coffeehousecentral.com', '0903333333', 'Lê Văn C', 'waiter', CURRENT_DATE, true),
        ($1, 'cashier@coffeehousecentral.com', '0904444444', 'Phạm Thị D', 'cashier', CURRENT_DATE, true),
        ($1, 'barista@coffeehousecentral.com', '0905555555', 'Hoàng Văn E', 'barista', CURRENT_DATE, true)
      RETURNING id, email, role;
    `, [shopId]);

    const employeeMap: Record<string, string> = {};
    employees.forEach((emp: any) => {
      employeeMap[emp.role] = emp.id;
    });

    // 9. Create Employee Permissions
    await queryRunner.query(`
      INSERT INTO employee_permission (employee_id, permission_code, is_granted)
      VALUES
        ($1, 'menu.manage', true),
        ($1, 'menu.view', true),
        ($1, 'order.create', true),
        ($1, 'order.update', true),
        ($1, 'order.cancel', true),
        ($1, 'order.view', true),
        ($1, 'payment.process', true),
        ($1, 'table.manage', true),
        ($1, 'table.view', true),
        ($1, 'inventory.manage', true),
        ($1, 'inventory.view', true),
        ($1, 'report.view', true),
        ($1, 'report.financial', true),
        ($1, 'employee.manage', true),
        ($1, 'employee.view', true)
    `, [employeeMap['owner']]);

    // 10. Create Ingredients
    const ingredients = await queryRunner.query(`
      INSERT INTO ingredient (
        shop_id, name, unit, current_stock, min_stock_level, unit_price, supplier, is_active
      )
      VALUES
        ($1, 'Cà phê hạt', 'kg', 50.00, 10.00, 200000, 'Nhà cung cấp A', true),
        ($1, 'Sữa tươi', 'l', 100.00, 20.00, 30000, 'Nhà cung cấp B', true),
        ($1, 'Đường', 'kg', 30.00, 5.00, 25000, 'Nhà cung cấp A', true),
        ($1, 'Dâu tươi', 'kg', 10.00, 2.00, 150000, 'Nhà cung cấp C', true),
        ($1, 'Cam', 'kg', 20.00, 5.00, 80000, 'Nhà cung cấp C', true),
        ($1, 'Bột mì', 'kg', 25.00, 5.00, 40000, 'Nhà cung cấp A', true),
        ($1, 'Trứng', 'quả', 200.00, 50.00, 3000, 'Nhà cung cấp B', true),
        ($1, 'Thịt nguội', 'kg', 15.00, 3.00, 200000, 'Nhà cung cấp D', true)
      RETURNING id, name;
    `, [shopId]);

    const ingredientMap: Record<string, string> = {};
    ingredients.forEach((ing: any) => {
      ingredientMap[ing.name] = ing.id;
    });

    // 11. Create Product Ingredients (Recipes)
    // Cà phê sữa: cà phê hạt, sữa tươi, đường
    await queryRunner.query(`
      INSERT INTO product_ingredient (product_id, ingredient_id, quantity_required, unit)
      VALUES
        ($1, $2, 0.02, 'kg'),
        ($1, $3, 0.05, 'l'),
        ($1, $4, 0.01, 'kg')
    `, [
      productMap['Cà phê sữa'], 
      ingredientMap['Cà phê hạt'], 
      ingredientMap['Sữa tươi'], 
      ingredientMap['Đường']
    ]);

    // Cà phê đá: cà phê hạt, sữa tươi, đường
    await queryRunner.query(`
      INSERT INTO product_ingredient (product_id, ingredient_id, quantity_required, unit)
      VALUES
        ($1, $2, 0.02, 'kg'),
        ($1, $3, 0.05, 'l'),
        ($1, $4, 0.01, 'kg')
    `, [
      productMap['Cà phê đá'], 
      ingredientMap['Cà phê hạt'], 
      ingredientMap['Sữa tươi'], 
      ingredientMap['Đường']
    ]);

    // Sinh tố dâu: dâu tươi, sữa tươi, đường
    await queryRunner.query(`
      INSERT INTO product_ingredient (product_id, ingredient_id, quantity_required, unit)
      VALUES
        ($1, $2, 0.15, 'kg'),
        ($1, $3, 0.1, 'l'),
        ($1, $4, 0.02, 'kg')
    `, [
      productMap['Sinh tố dâu'], 
      ingredientMap['Dâu tươi'], 
      ingredientMap['Sữa tươi'], 
      ingredientMap['Đường']
    ]);

    // Nước ép cam: cam
    await queryRunner.query(`
      INSERT INTO product_ingredient (product_id, ingredient_id, quantity_required, unit)
      VALUES
        ($1, $2, 0.2, 'kg')
    `, [
      productMap['Nước ép cam'], 
      ingredientMap['Cam']
    ]);

    // Bánh kem socola: bột mì, sữa tươi
    await queryRunner.query(`
      INSERT INTO product_ingredient (product_id, ingredient_id, quantity_required, unit)
      VALUES
        ($1, $2, 0.2, 'kg'),
        ($1, $3, 0.05, 'l')
    `, [
      productMap['Bánh kem socola'], 
      ingredientMap['Bột mì'], 
      ingredientMap['Sữa tươi']
    ]);

    // 12. Create Inventory Transactions
    await queryRunner.query(`
      INSERT INTO inventory_transaction (
        shop_id, ingredient_id, transaction_type, quantity, unit_price, total_amount,
        reason, created_by, created_at
      )
      VALUES
        ($1, $2, 'in', 50.00, 200000, 10000000, 'Nhập kho ban đầu', $3, CURRENT_TIMESTAMP),
        ($1, $4, 'in', 100.00, 30000, 3000000, 'Nhập kho ban đầu', $3, CURRENT_TIMESTAMP),
        ($1, $5, 'in', 30.00, 25000, 750000, 'Nhập kho ban đầu', $3, CURRENT_TIMESTAMP)
    `, [shopId, ingredientMap['Cà phê hạt'], employeeMap['owner'], ingredientMap['Sữa tươi'], ingredientMap['Đường']]);

    await queryRunner.commitTransaction();
    console.log('✅ Seed data created successfully!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// Run seed if executed directly
if (require.main === module) {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    } : false,
  });

  dataSource
    .initialize()
    .then(async () => {
      await seedCoffeeShopManagement(dataSource);
      await dataSource.destroy();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

