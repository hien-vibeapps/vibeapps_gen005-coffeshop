import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductEntity } from '../../../infrastructure/persistence/typeorm/entities/product.entity';
import { ProductImageEntity } from '../../../infrastructure/persistence/typeorm/entities/product-image.entity';
import { ProductOptionGroupEntity } from '../../../infrastructure/persistence/typeorm/entities/product-option-group.entity';
import { ProductOptionEntity } from '../../../infrastructure/persistence/typeorm/entities/product-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductImageEntity, ProductOptionGroupEntity, ProductOptionEntity])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}

