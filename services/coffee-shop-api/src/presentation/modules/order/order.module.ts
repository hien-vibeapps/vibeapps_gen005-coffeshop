import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from '../../../infrastructure/persistence/typeorm/entities/order.entity';
import { OrderItemEntity } from '../../../infrastructure/persistence/typeorm/entities/order-item.entity';
import { ProductEntity } from '../../../infrastructure/persistence/typeorm/entities/product.entity';
import { ShopEntity } from '../../../infrastructure/persistence/typeorm/entities/shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ProductEntity, ShopEntity])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

