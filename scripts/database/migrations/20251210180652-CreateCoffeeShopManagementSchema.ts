import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique, TableCheck } from 'typeorm';

export class CreateCoffeeShopManagementSchema20251210180652 implements MigrationInterface {
  name = 'CreateCoffeeShopManagementSchema20251210180652';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create shop table
    await queryRunner.createTable(
      new Table({
        name: 'shop',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'logo_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'opening_time',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'closing_time',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'facebook',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'instagram',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '10',
            default: "'VND'",
          },
          {
            name: 'timezone',
            type: 'varchar',
            length: '50',
            default: "'Asia/Ho_Chi_Minh'",
          },
          {
            name: 'vat_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 10.0,
          },
          {
            name: 'service_fee_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Add constraints and indexes for shop
    await queryRunner.createIndex('shop', new TableIndex({ columnNames: ['is_active'] }));
    await queryRunner.createUniqueConstraint('shop', new TableUnique({ columnNames: ['name'] }));
    await queryRunner.createUniqueConstraint('shop', new TableUnique({ columnNames: ['email'] }));
    await queryRunner.createCheckConstraint(
      'shop',
      new TableCheck({
        expression: `vat_rate >= 0 AND vat_rate <= 100`,
        name: 'check_shop_vat_rate',
      }),
    );
    await queryRunner.createCheckConstraint(
      'shop',
      new TableCheck({
        expression: `service_fee_rate >= 0 AND service_fee_rate <= 100`,
        name: 'check_shop_service_fee_rate',
      }),
    );

    // 2. Create category table
    await queryRunner.createTable(
      new Table({
        name: 'category',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'shop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'display_order',
            type: 'integer',
            default: 0,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'category',
      new TableForeignKey({
        columnNames: ['shop_id'],
        referencedTableName: 'shop',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createUniqueConstraint('category', new TableUnique({ columnNames: ['shop_id', 'name'] }));
    await queryRunner.createIndex('category', new TableIndex({ columnNames: ['shop_id', 'is_active', 'display_order'] }));

    // 3. Create product table
    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'shop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'estimated_prep_time',
            type: 'integer',
            default: 0,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'available'",
          },
          {
            name: 'calories',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'allergen_info',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'display_order',
            type: 'integer',
            default: 0,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['shop_id'],
        referencedTableName: 'shop',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'category',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createUniqueConstraint('product', new TableUnique({ columnNames: ['shop_id', 'category_id', 'name'] }));
    await queryRunner.createIndex('product', new TableIndex({ columnNames: ['shop_id', 'category_id', 'is_active', 'status'] }));
    await queryRunner.createIndex('product', new TableIndex({ columnNames: ['shop_id', 'display_order'] }));
    await queryRunner.createCheckConstraint(
      'product',
      new TableCheck({
        expression: `price > 0`,
        name: 'check_product_price',
      }),
    );
    await queryRunner.createCheckConstraint(
      'product',
      new TableCheck({
        expression: `estimated_prep_time >= 0 AND estimated_prep_time <= 120`,
        name: 'check_product_prep_time',
      }),
    );
    await queryRunner.createCheckConstraint(
      'product',
      new TableCheck({
        expression: `status IN ('available', 'out_of_stock', 'suspended')`,
        name: 'check_product_status',
      }),
    );

    // 4. Create product_image table
    await queryRunner.createTable(
      new Table({
        name: 'product_image',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'display_order',
            type: 'integer',
            default: 0,
          },
          {
            name: 'is_primary',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'product_image',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'product',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex('product_image', new TableIndex({ columnNames: ['product_id', 'display_order'] }));
    await queryRunner.createCheckConstraint(
      'product_image',
      new TableCheck({
        expression: `display_order >= 0`,
        name: 'check_product_image_display_order',
      }),
    );

    // 5. Create product_option_group table
    await queryRunner.createTable(
      new Table({
        name: 'product_option_group',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'is_required',
            type: 'boolean',
            default: false,
          },
          {
            name: 'max_selections',
            type: 'integer',
            default: 1,
          },
          {
            name: 'display_order',
            type: 'integer',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'product_option_group',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'product',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createIndex('product_option_group', new TableIndex({ columnNames: ['product_id', 'display_order'] }));
    await queryRunner.createCheckConstraint(
      'product_option_group',
      new TableCheck({
        expression: `max_selections >= 1`,
        name: 'check_product_option_group_max_selections',
      }),
    );

    // 6. Create product_option table
    await queryRunner.createTable(
      new Table({
        name: 'product_option',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'option_group_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'price_adjustment',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'display_order',
            type: 'integer',
            default: 0,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'product_option',
      new TableForeignKey({
        columnNames: ['option_group_id'],
        referencedTableName: 'product_option_group',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createUniqueConstraint('product_option', new TableUnique({ columnNames: ['option_group_id', 'name'] }));
    await queryRunner.createIndex('product_option', new TableIndex({ columnNames: ['option_group_id', 'display_order'] }));
    await queryRunner.createCheckConstraint(
      'product_option',
      new TableCheck({
        expression: `price_adjustment >= -9999999.99 AND price_adjustment <= 9999999.99`,
        name: 'check_product_option_price_adjustment',
      }),
    );

    // 7. Create area table
    await queryRunner.createTable(
      new Table({
        name: 'area',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'shop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'floor_plan_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'area',
      new TableForeignKey({
        columnNames: ['shop_id'],
        referencedTableName: 'shop',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createUniqueConstraint('area', new TableUnique({ columnNames: ['shop_id', 'name'] }));
    await queryRunner.createIndex('area', new TableIndex({ columnNames: ['shop_id', 'is_active'] }));

    // 8. Create table table
    await queryRunner.createTable(
      new Table({
        name: 'table',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'area_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'table_number',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'capacity',
            type: 'integer',
            default: 4,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'available'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'position_x',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'position_y',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'table',
      new TableForeignKey({
        columnNames: ['area_id'],
        referencedTableName: 'area',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createUniqueConstraint('table', new TableUnique({ columnNames: ['area_id', 'table_number'] }));
    await queryRunner.createIndex('table', new TableIndex({ columnNames: ['area_id', 'status', 'is_active'] }));
    await queryRunner.createCheckConstraint(
      'table',
      new TableCheck({
        expression: `capacity > 0 AND capacity <= 50`,
        name: 'check_table_capacity',
      }),
    );
    await queryRunner.createCheckConstraint(
      'table',
      new TableCheck({
        expression: `status IN ('available', 'occupied', 'reserved', 'maintenance')`,
        name: 'check_table_status',
      }),
    );

    // 9. Create employee table
    await queryRunner.createTable(
      new Table({
        name: 'employee',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'shop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'full_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'avatar_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'last_login_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'employee',
      new TableForeignKey({
        columnNames: ['shop_id'],
        referencedTableName: 'shop',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createUniqueConstraint('employee', new TableUnique({ columnNames: ['email'] }));
    await queryRunner.createUniqueConstraint('employee', new TableUnique({ columnNames: ['phone'] }));
    await queryRunner.createIndex('employee', new TableIndex({ columnNames: ['shop_id', 'role', 'is_active'] }));
    await queryRunner.createCheckConstraint(
      'employee',
      new TableCheck({
        expression: `role IN ('owner', 'manager', 'shift_manager', 'waiter', 'cashier', 'barista')`,
        name: 'check_employee_role',
      }),
    );

    // 10. Create employee_permission table
    await queryRunner.createTable(
      new Table({
        name: 'employee_permission',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'employee_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'permission_code',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'is_granted',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'employee_permission',
      new TableForeignKey({
        columnNames: ['employee_id'],
        referencedTableName: 'employee',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createUniqueConstraint('employee_permission', new TableUnique({ columnNames: ['employee_id', 'permission_code'] }));

    // 11. Create table_reservation table
    await queryRunner.createTable(
      new Table({
        name: 'table_reservation',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'shop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'table_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'customer_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'customer_phone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'reservation_time',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'number_of_guests',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'cancelled_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancelled_reason',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'table_reservation',
      new TableForeignKey({
        columnNames: ['shop_id'],
        referencedTableName: 'shop',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'table_reservation',
      new TableForeignKey({
        columnNames: ['table_id'],
        referencedTableName: 'table',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'table_reservation',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'employee',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createIndex('table_reservation', new TableIndex({ columnNames: ['shop_id', 'reservation_time', 'status'] }));
    await queryRunner.createIndex('table_reservation', new TableIndex({ columnNames: ['table_id', 'reservation_time', 'status'] }));
    await queryRunner.createCheckConstraint(
      'table_reservation',
      new TableCheck({
        expression: `number_of_guests > 0 AND number_of_guests <= 50`,
        name: 'check_table_reservation_guests',
      }),
    );
    await queryRunner.createCheckConstraint(
      'table_reservation',
      new TableCheck({
        expression: `status IN ('pending', 'confirmed', 'cancelled', 'completed')`,
        name: 'check_table_reservation_status',
      }),
    );

    // 12. Create order table
    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'shop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'order_number',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'table_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'order_type',
            type: 'varchar',
            length: '20',
            default: "'dine_in'",
          },
          {
            name: 'customer_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'customer_phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'delivery_address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'delivery_fee',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'vat_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'service_fee',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'served_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'cancelled_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'cancelled_reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'paid_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancelled_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['shop_id'],
        referencedTableName: 'shop',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['table_id'],
        referencedTableName: 'table',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'employee',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['served_by'],
        referencedTableName: 'employee',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['cancelled_by'],
        referencedTableName: 'employee',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createUniqueConstraint('order', new TableUnique({ columnNames: ['order_number'] }));
    await queryRunner.createIndex('order', new TableIndex({ columnNames: ['shop_id', 'status', 'created_at'] }));
    await queryRunner.createIndex('order', new TableIndex({ columnNames: ['shop_id', 'table_id', 'status'] }));
    await queryRunner.createIndex('order', new TableIndex({ columnNames: ['shop_id', 'created_at'] }));
    await queryRunner.createIndex('order', new TableIndex({ columnNames: ['created_by', 'created_at'] }));
    await queryRunner.createCheckConstraint(
      'order',
      new TableCheck({
        expression: `order_type IN ('dine_in', 'takeaway', 'delivery')`,
        name: 'check_order_type',
      }),
    );
    await queryRunner.createCheckConstraint(
      'order',
      new TableCheck({
        expression: `status IN ('pending', 'preparing', 'ready', 'served', 'paid', 'cancelled')`,
        name: 'check_order_status',
      }),
    );
    await queryRunner.createCheckConstraint(
      'order',
      new TableCheck({
        expression: `subtotal >= 0`,
        name: 'check_order_subtotal',
      }),
    );
    await queryRunner.createCheckConstraint(
      'order',
      new TableCheck({
        expression: `vat_amount >= 0`,
        name: 'check_order_vat_amount',
      }),
    );
    await queryRunner.createCheckConstraint(
      'order',
      new TableCheck({
        expression: `service_fee >= 0`,
        name: 'check_order_service_fee',
      }),
    );
    await queryRunner.createCheckConstraint(
      'order',
      new TableCheck({
        expression: `delivery_fee >= 0`,
        name: 'check_order_delivery_fee',
      }),
    );
    await queryRunner.createCheckConstraint(
      'order',
      new TableCheck({
        expression: `total_amount >= 0`,
        name: 'check_order_total_amount',
      }),
    );

    // 13. Create order_item table
    await queryRunner.createTable(
      new Table({
        name: 'order_item',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'product_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'product_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'selected_options',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'order_item',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedTableName: 'order',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'order_item',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'product',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createIndex('order_item', new TableIndex({ columnNames: ['order_id'] }));
    await queryRunner.createIndex('order_item', new TableIndex({ columnNames: ['product_id'] }));
    await queryRunner.createCheckConstraint(
      'order_item',
      new TableCheck({
        expression: `quantity > 0 AND quantity <= 999`,
        name: 'check_order_item_quantity',
      }),
    );
    await queryRunner.createCheckConstraint(
      'order_item',
      new TableCheck({
        expression: `unit_price >= 0`,
        name: 'check_order_item_unit_price',
      }),
    );
    await queryRunner.createCheckConstraint(
      'order_item',
      new TableCheck({
        expression: `subtotal >= 0`,
        name: 'check_order_item_subtotal',
      }),
    );
    await queryRunner.createCheckConstraint(
      'order_item',
      new TableCheck({
        expression: `status IN ('pending', 'preparing', 'ready', 'served')`,
        name: 'check_order_item_status',
      }),
    );

    // 14. Create payment table
    await queryRunner.createTable(
      new Table({
        name: 'payment',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'payment_method',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'received_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'change_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'transaction_id',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'receipt_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'processed_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'processed_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'payment',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedTableName: 'order',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'payment',
      new TableForeignKey({
        columnNames: ['processed_by'],
        referencedTableName: 'employee',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createUniqueConstraint('payment', new TableUnique({ columnNames: ['receipt_number'] }));
    await queryRunner.createIndex('payment', new TableIndex({ columnNames: ['order_id'] }));
    await queryRunner.createIndex('payment', new TableIndex({ columnNames: ['processed_by', 'processed_at'] }));
    await queryRunner.createCheckConstraint(
      'payment',
      new TableCheck({
        expression: `amount > 0`,
        name: 'check_payment_amount',
      }),
    );
    await queryRunner.createCheckConstraint(
      'payment',
      new TableCheck({
        expression: `payment_method IN ('cash', 'card', 'bank_transfer', 'e_wallet')`,
        name: 'check_payment_method',
      }),
    );

    // 15. Create ingredient table
    await queryRunner.createTable(
      new Table({
        name: 'ingredient',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'shop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'unit',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'current_stock',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'min_stock_level',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'supplier',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'expiry_tracking',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'ingredient',
      new TableForeignKey({
        columnNames: ['shop_id'],
        referencedTableName: 'shop',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createUniqueConstraint('ingredient', new TableUnique({ columnNames: ['shop_id', 'name'] }));
    await queryRunner.createIndex('ingredient', new TableIndex({ columnNames: ['shop_id', 'is_active'] }));
    await queryRunner.createIndex('ingredient', new TableIndex({ columnNames: ['shop_id', 'current_stock', 'min_stock_level'] }));
    await queryRunner.createCheckConstraint(
      'ingredient',
      new TableCheck({
        expression: `current_stock >= 0`,
        name: 'check_ingredient_current_stock',
      }),
    );
    await queryRunner.createCheckConstraint(
      'ingredient',
      new TableCheck({
        expression: `min_stock_level >= 0`,
        name: 'check_ingredient_min_stock_level',
      }),
    );
    await queryRunner.createCheckConstraint(
      'ingredient',
      new TableCheck({
        expression: `unit_price >= 0`,
        name: 'check_ingredient_unit_price',
      }),
    );

    // 16. Create product_ingredient table
    await queryRunner.createTable(
      new Table({
        name: 'product_ingredient',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'product_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'ingredient_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'quantity_required',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'unit',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'product_ingredient',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'product',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'product_ingredient',
      new TableForeignKey({
        columnNames: ['ingredient_id'],
        referencedTableName: 'ingredient',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createUniqueConstraint('product_ingredient', new TableUnique({ columnNames: ['product_id', 'ingredient_id'] }));
    await queryRunner.createIndex('product_ingredient', new TableIndex({ columnNames: ['product_id'] }));
    await queryRunner.createIndex('product_ingredient', new TableIndex({ columnNames: ['ingredient_id'] }));
    await queryRunner.createCheckConstraint(
      'product_ingredient',
      new TableCheck({
        expression: `quantity_required > 0`,
        name: 'check_product_ingredient_quantity',
      }),
    );

    // 17. Create inventory_transaction table
    await queryRunner.createTable(
      new Table({
        name: 'inventory_transaction',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'shop_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'ingredient_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'transaction_type',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'reason',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'reference_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'reference_type',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'expiry_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'inventory_transaction',
      new TableForeignKey({
        columnNames: ['shop_id'],
        referencedTableName: 'shop',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'inventory_transaction',
      new TableForeignKey({
        columnNames: ['ingredient_id'],
        referencedTableName: 'ingredient',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'inventory_transaction',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'employee',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createIndex('inventory_transaction', new TableIndex({ columnNames: ['shop_id', 'ingredient_id', 'created_at'] }));
    await queryRunner.createIndex('inventory_transaction', new TableIndex({ columnNames: ['shop_id', 'transaction_type', 'created_at'] }));
    await queryRunner.createIndex('inventory_transaction', new TableIndex({ columnNames: ['reference_id', 'reference_type'] }));
    await queryRunner.createCheckConstraint(
      'inventory_transaction',
      new TableCheck({
        expression: `transaction_type IN ('in', 'out', 'auto_deduct')`,
        name: 'check_inventory_transaction_type',
      }),
    );
    await queryRunner.createCheckConstraint(
      'inventory_transaction',
      new TableCheck({
        expression: `quantity > 0`,
        name: 'check_inventory_transaction_quantity',
      }),
    );

    // 18. Create audit_log table
    await queryRunner.createTable(
      new Table({
        name: 'audit_log',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'shop_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'entity_type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'entity_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'old_values',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'new_values',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'audit_log',
      new TableForeignKey({
        columnNames: ['shop_id'],
        referencedTableName: 'shop',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'audit_log',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'employee',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createIndex('audit_log', new TableIndex({ columnNames: ['shop_id', 'entity_type', 'entity_id', 'created_at'] }));
    await queryRunner.createIndex('audit_log', new TableIndex({ columnNames: ['user_id', 'created_at'] }));
    await queryRunner.createIndex('audit_log', new TableIndex({ columnNames: ['created_at'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order (child tables first)
    await queryRunner.dropTable('audit_log', true);
    await queryRunner.dropTable('inventory_transaction', true);
    await queryRunner.dropTable('product_ingredient', true);
    await queryRunner.dropTable('ingredient', true);
    await queryRunner.dropTable('payment', true);
    await queryRunner.dropTable('order_item', true);
    await queryRunner.dropTable('order', true);
    await queryRunner.dropTable('table_reservation', true);
    await queryRunner.dropTable('employee_permission', true);
    await queryRunner.dropTable('employee', true);
    await queryRunner.dropTable('table', true);
    await queryRunner.dropTable('area', true);
    await queryRunner.dropTable('product_option', true);
    await queryRunner.dropTable('product_option_group', true);
    await queryRunner.dropTable('product_image', true);
    await queryRunner.dropTable('product', true);
    await queryRunner.dropTable('category', true);
    await queryRunner.dropTable('shop', true);
  }
}

