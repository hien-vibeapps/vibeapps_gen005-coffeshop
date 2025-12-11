import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { IngredientEntity } from '../../../infrastructure/persistence/typeorm/entities/ingredient.entity';
import { InventoryTransactionEntity } from '../../../infrastructure/persistence/typeorm/entities/inventory-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientEntity, InventoryTransactionEntity])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}

