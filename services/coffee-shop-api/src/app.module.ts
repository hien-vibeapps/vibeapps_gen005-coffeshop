import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopModule } from './presentation/modules/shop/shop.module';
import { CategoryModule } from './presentation/modules/category/category.module';
import { ProductModule } from './presentation/modules/product/product.module';
import { TableModule } from './presentation/modules/table/table.module';
import { EmployeeModule } from './presentation/modules/employee/employee.module';
import { OrderModule } from './presentation/modules/order/order.module';
import { PaymentModule } from './presentation/modules/payment/payment.module';
import { InventoryModule } from './presentation/modules/inventory/inventory.module';
import { ReportModule } from './presentation/modules/report/report.module';
// Import entities directly
import { ShopEntity } from './infrastructure/persistence/typeorm/entities/shop.entity';
import { CategoryEntity } from './infrastructure/persistence/typeorm/entities/category.entity';
import { ProductEntity } from './infrastructure/persistence/typeorm/entities/product.entity';
import { AreaEntity } from './infrastructure/persistence/typeorm/entities/area.entity';
import { TableEntity } from './infrastructure/persistence/typeorm/entities/table.entity';
import { EmployeeEntity } from './infrastructure/persistence/typeorm/entities/employee.entity';
import { OrderEntity } from './infrastructure/persistence/typeorm/entities/order.entity';
import { OrderItemEntity } from './infrastructure/persistence/typeorm/entities/order-item.entity';
import { PaymentEntity } from './infrastructure/persistence/typeorm/entities/payment.entity';
import { IngredientEntity } from './infrastructure/persistence/typeorm/entities/ingredient.entity';
import { InventoryTransactionEntity } from './infrastructure/persistence/typeorm/entities/inventory-transaction.entity';
import { ProductImageEntity } from './infrastructure/persistence/typeorm/entities/product-image.entity';
import { ProductOptionEntity } from './infrastructure/persistence/typeorm/entities/product-option.entity';
import { ProductOptionGroupEntity } from './infrastructure/persistence/typeorm/entities/product-option-group.entity';
import { TableReservationEntity } from './infrastructure/persistence/typeorm/entities/table-reservation.entity';
import { EmployeePermissionEntity } from './infrastructure/persistence/typeorm/entities/employee-permission.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env', '../../.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'coffee_shop',
      entities: [
        ShopEntity,
        CategoryEntity,
        ProductEntity,
        AreaEntity,
        TableEntity,
        EmployeeEntity,
        OrderEntity,
        OrderItemEntity,
        PaymentEntity,
        IngredientEntity,
        InventoryTransactionEntity,
        ProductImageEntity,
        ProductOptionEntity,
        ProductOptionGroupEntity,
        TableReservationEntity,
        EmployeePermissionEntity,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.DB_SSL === 'true' || process.env.DB_SSL === '1' ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      } : false,
    }),
    ShopModule,
    CategoryModule,
    ProductModule,
    TableModule,
    EmployeeModule,
    OrderModule,
    PaymentModule,
    InventoryModule,
    ReportModule,
  ],
})
export class AppModule {}

