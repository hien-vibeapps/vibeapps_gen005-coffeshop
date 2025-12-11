import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { OrderEntity } from '../../../infrastructure/persistence/typeorm/entities/order.entity';
import { OrderItemEntity } from '../../../infrastructure/persistence/typeorm/entities/order-item.entity';
import { PaymentEntity } from '../../../infrastructure/persistence/typeorm/entities/payment.entity';
import { IngredientEntity } from '../../../infrastructure/persistence/typeorm/entities/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, PaymentEntity, IngredientEntity])],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}

