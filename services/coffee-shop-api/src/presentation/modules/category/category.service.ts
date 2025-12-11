import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { CategoryEntity } from '../../../infrastructure/persistence/typeorm/entities/category.entity';
import { CreateCategoryDto } from '../../../application/dto/category/create-category.dto';
import { UpdateCategoryDto } from '../../../application/dto/category/update-category.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(pagination: PaginationDto): Promise<PaginatedResponseDto<CategoryEntity>> {
    const { page = 1, limit = 10, search, sort, order = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (search) {
      queryBuilder.where('category.name ILIKE :search', { search: `%${search}%` });
    }

    if (sort) {
      queryBuilder.orderBy(`category.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('category.created_at', 'DESC');
    }

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findById(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['shop'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(createDto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = this.categoryRepository.create({
      ...createDto,
      display_order: createDto.display_order ?? 0,
      is_active: createDto.is_active ?? true,
    });
    return await this.categoryRepository.save(category);
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.findById(id);
    Object.assign(category, updateDto);
    return await this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.findById(id);
    await this.categoryRepository.softRemove(category);
  }

  async getStatistics(shopId?: string): Promise<any> {
    // Status distribution
    const statusQuery = this.categoryRepository.createQueryBuilder('category');
    if (shopId) {
      statusQuery.where('category.shop_id = :shopId', { shopId });
    }
    statusQuery.andWhere('category.deleted_at IS NULL');

    const statusDistribution = await statusQuery
      .select('category.is_active', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('category.is_active')
      .getRawMany();

    // Product count distribution - join with product table
    const productCountQuery = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('product', 'product', 'product.category_id = category.id AND product.deleted_at IS NULL')
      .select('category.id', 'category_id')
      .addSelect('COUNT(product.id)', 'product_count')
      .where(shopId ? 'category.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('category.deleted_at IS NULL')
      .groupBy('category.id');

    const productCountDistribution = await productCountQuery.getRawMany();

    // Categorize product counts
    const ranges = {
      '0': 0,
      '1-10': 0,
      '11-50': 0,
      '> 50': 0,
    };

    productCountDistribution.forEach((item) => {
      const count = parseInt(item.product_count, 10);
      if (count === 0) ranges['0']++;
      else if (count <= 10) ranges['1-10']++;
      else if (count <= 50) ranges['11-50']++;
      else ranges['> 50']++;
    });

    const productCountDistributionFormatted = Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }));

    // Total counts
    const totalQuery = this.categoryRepository.createQueryBuilder('category');
    if (shopId) {
      totalQuery.where('category.shop_id = :shopId', { shopId });
    }
    totalQuery.andWhere('category.deleted_at IS NULL');
    const totalCategories = await totalQuery.getCount();

    const activeQuery = this.categoryRepository.createQueryBuilder('category');
    if (shopId) {
      activeQuery.where('category.shop_id = :shopId', { shopId });
    }
    activeQuery.andWhere('category.is_active = :isActive', { isActive: true });
    activeQuery.andWhere('category.deleted_at IS NULL');
    const activeCategories = await activeQuery.getCount();

    const categoriesWithProducts = productCountDistribution.filter((item) => parseInt(item.product_count, 10) > 0).length;

    return {
      statusDistribution: statusDistribution.map((item) => ({
        status: item.status ? 'Active' : 'Inactive',
        count: parseInt(item.count, 10),
      })),
      productCountDistribution: productCountDistributionFormatted,
      totalCategories,
      activeCategories,
      categoriesWithProducts,
    };
  }
}

