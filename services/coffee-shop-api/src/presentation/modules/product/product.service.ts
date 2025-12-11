import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../../infrastructure/persistence/typeorm/entities/product.entity';
import { ProductImageEntity } from '../../../infrastructure/persistence/typeorm/entities/product-image.entity';
import { ProductOptionGroupEntity } from '../../../infrastructure/persistence/typeorm/entities/product-option-group.entity';
import { ProductOptionEntity } from '../../../infrastructure/persistence/typeorm/entities/product-option.entity';
import { CreateProductDto } from '../../../application/dto/product/create-product.dto';
import { UpdateProductDto } from '../../../application/dto/product/update-product.dto';
import { ProductListQueryDto } from '../../../application/dto/product/product-list-query.dto';
import { PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity)
    private productImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(ProductOptionGroupEntity)
    private optionGroupRepository: Repository<ProductOptionGroupEntity>,
    @InjectRepository(ProductOptionEntity)
    private optionRepository: Repository<ProductOptionEntity>,
  ) {}

  async findAll(query: ProductListQueryDto): Promise<PaginatedResponseDto<ProductEntity>> {
    const { page = 1, limit = 10, search, sort, order = 'desc', category_id, status, is_active } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.option_groups', 'option_groups')
      .leftJoinAndSelect('option_groups.options', 'options');

    if (search) {
      queryBuilder.where('product.name ILIKE :search', { search: `%${search}%` });
    }

    if (category_id) {
      queryBuilder.andWhere('product.category_id = :category_id', { category_id });
    }

    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    }

    if (is_active !== undefined) {
      queryBuilder.andWhere('product.is_active = :is_active', { is_active });
    }

    if (sort) {
      queryBuilder.orderBy(`product.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('product.display_order', 'ASC').addOrderBy('product.created_at', 'DESC');
    }

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'images', 'option_groups', 'option_groups.options'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createDto: CreateProductDto): Promise<ProductEntity> {
    const product = this.productRepository.create({
      ...createDto,
      estimated_prep_time: createDto.estimated_prep_time ?? 0,
      status: createDto.status ?? 'available',
      display_order: createDto.display_order ?? 0,
      is_active: createDto.is_active ?? true,
    });
    return await this.productRepository.save(product);
  }

  async update(id: string, updateDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.findById(id);
    Object.assign(product, updateDto);
    return await this.productRepository.save(product);
  }

  async delete(id: string): Promise<void> {
    const product = await this.findById(id);
    await this.productRepository.softRemove(product);
  }

  async getStatistics(shopId?: string): Promise<any> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (shopId) {
      queryBuilder.where('product.shop_id = :shopId', { shopId });
    }
    queryBuilder.andWhere('product.deleted_at IS NULL');

    // Status distribution
    const statusDistribution = await queryBuilder
      .select('product.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('product.status')
      .getRawMany();

    // Category distribution
    const categoryDistribution = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('category', 'category', 'category.id = product.category_id')
      .select('category.name', 'category')
      .addSelect('COUNT(product.id)', 'count')
      .where(shopId ? 'product.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('product.deleted_at IS NULL')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .getRawMany();

    // Total counts
    const totalProducts = await queryBuilder.getCount();

    const availableProducts = await this.productRepository
      .createQueryBuilder('product')
      .where(shopId ? 'product.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('product.status = :status', { status: 'available' })
      .andWhere('product.deleted_at IS NULL')
      .getCount();

    const outOfStockProducts = await this.productRepository
      .createQueryBuilder('product')
      .where(shopId ? 'product.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('product.status = :status', { status: 'out_of_stock' })
      .andWhere('product.deleted_at IS NULL')
      .getCount();

    const suspendedProducts = await this.productRepository
      .createQueryBuilder('product')
      .where(shopId ? 'product.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('product.status = :status', { status: 'suspended' })
      .andWhere('product.deleted_at IS NULL')
      .getCount();

    return {
      statusDistribution: statusDistribution.map((item) => ({
        status: item.status,
        count: parseInt(item.count, 10),
      })),
      categoryDistribution: categoryDistribution.map((item) => ({
        category: item.category || 'Unknown',
        count: parseInt(item.count, 10),
      })),
      totalProducts,
      availableProducts,
      outOfStockProducts,
      suspendedProducts,
    };
  }

  // Product Images
  async uploadProductImage(productId: string, imageUrl: string, displayOrder?: number, isPrimary?: boolean): Promise<ProductImageEntity> {
    const product = await this.findById(productId);

    // If this is set as primary, unset other primary images
    if (isPrimary) {
      await this.productImageRepository.update(
        { product_id: productId },
        { is_primary: false },
      );
    }

    const image = this.productImageRepository.create({
      product_id: productId,
      image_url: imageUrl,
      display_order: displayOrder ?? 0,
      is_primary: isPrimary ?? false,
    });

    return await this.productImageRepository.save(image);
  }

  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    const image = await this.productImageRepository.findOne({
      where: { id: imageId, product_id: productId },
    });

    if (!image) {
      throw new NotFoundException(`Product image with ID ${imageId} not found`);
    }

    await this.productImageRepository.remove(image);
  }

  // Product Option Groups
  async createOptionGroup(productId: string, createDto: any): Promise<ProductOptionGroupEntity> {
    const product = await this.findById(productId);

    const optionGroup = this.optionGroupRepository.create({
      product_id: productId,
      name: createDto.name,
      is_required: createDto.is_required ?? false,
      max_selections: createDto.max_selections ?? 1,
      display_order: createDto.display_order ?? 0,
    });

    return await this.optionGroupRepository.save(optionGroup);
  }

  async updateOptionGroup(productId: string, optionGroupId: string, updateDto: any): Promise<ProductOptionGroupEntity> {
    const product = await this.findById(productId);

    const optionGroup = await this.optionGroupRepository.findOne({
      where: { id: optionGroupId, product_id: productId },
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group with ID ${optionGroupId} not found`);
    }

    Object.assign(optionGroup, updateDto);
    return await this.optionGroupRepository.save(optionGroup);
  }

  async deleteOptionGroup(productId: string, optionGroupId: string): Promise<void> {
    const product = await this.findById(productId);

    const optionGroup = await this.optionGroupRepository.findOne({
      where: { id: optionGroupId, product_id: productId },
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group with ID ${optionGroupId} not found`);
    }

    await this.optionGroupRepository.remove(optionGroup);
  }

  // Product Options
  async createOption(productId: string, optionGroupId: string, createDto: any): Promise<ProductOptionEntity> {
    const product = await this.findById(productId);

    const optionGroup = await this.optionGroupRepository.findOne({
      where: { id: optionGroupId, product_id: productId },
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group with ID ${optionGroupId} not found`);
    }

    const option = this.optionRepository.create({
      option_group_id: optionGroupId,
      name: createDto.name,
      price_adjustment: createDto.price_adjustment ?? 0,
      display_order: createDto.display_order ?? 0,
      is_active: createDto.is_active ?? true,
    });

    return await this.optionRepository.save(option);
  }

  async updateOption(productId: string, optionGroupId: string, optionId: string, updateDto: any): Promise<ProductOptionEntity> {
    const product = await this.findById(productId);

    const optionGroup = await this.optionGroupRepository.findOne({
      where: { id: optionGroupId, product_id: productId },
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group with ID ${optionGroupId} not found`);
    }

    const option = await this.optionRepository.findOne({
      where: { id: optionId, option_group_id: optionGroupId },
    });

    if (!option) {
      throw new NotFoundException(`Option with ID ${optionId} not found`);
    }

    Object.assign(option, updateDto);
    return await this.optionRepository.save(option);
  }

  async deleteOption(productId: string, optionGroupId: string, optionId: string): Promise<void> {
    const product = await this.findById(productId);

    const optionGroup = await this.optionGroupRepository.findOne({
      where: { id: optionGroupId, product_id: productId },
    });

    if (!optionGroup) {
      throw new NotFoundException(`Option group with ID ${optionGroupId} not found`);
    }

    const option = await this.optionRepository.findOne({
      where: { id: optionId, option_group_id: optionGroupId },
    });

    if (!option) {
      throw new NotFoundException(`Option with ID ${optionId} not found`);
    }

    await this.optionRepository.remove(option);
  }
}

