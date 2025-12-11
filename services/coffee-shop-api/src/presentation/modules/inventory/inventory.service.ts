import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IngredientEntity } from '../../../infrastructure/persistence/typeorm/entities/ingredient.entity';
import { InventoryTransactionEntity } from '../../../infrastructure/persistence/typeorm/entities/inventory-transaction.entity';
import { CreateIngredientDto } from '../../../application/dto/inventory/create-ingredient.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(IngredientEntity)
    private ingredientRepository: Repository<IngredientEntity>,
    @InjectRepository(InventoryTransactionEntity)
    private transactionRepository: Repository<InventoryTransactionEntity>,
    private dataSource: DataSource,
  ) {}

  async findAllIngredients(pagination: PaginationDto & { is_active?: boolean; shop_id?: string }): Promise<PaginatedResponseDto<IngredientEntity>> {
    const { page = 1, limit = 10, search, sort, order = 'desc', is_active, shop_id } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.ingredientRepository.createQueryBuilder('ingredient');

    if (shop_id) {
      queryBuilder.where('ingredient.shop_id = :shop_id', { shop_id });
    }

    if (is_active !== undefined) {
      queryBuilder.andWhere('ingredient.is_active = :is_active', { is_active });
    }

    if (search) {
      queryBuilder.andWhere('(ingredient.name ILIKE :search)', { search: `%${search}%` });
    }

    if (sort) {
      queryBuilder.orderBy(`ingredient.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('ingredient.created_at', 'DESC');
    }

    queryBuilder.andWhere('ingredient.deleted_at IS NULL').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findIngredientById(id: string): Promise<IngredientEntity> {
    const ingredient = await this.ingredientRepository.findOne({ where: { id } });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }
    return ingredient;
  }

  async createIngredient(createDto: CreateIngredientDto): Promise<IngredientEntity> {
    const ingredient = this.ingredientRepository.create({
      ...createDto,
      current_stock: createDto.current_stock ?? 0,
      min_stock_level: createDto.min_stock_level ?? 0,
      unit_price: createDto.unit_price ?? 0,
      expiry_tracking: createDto.expiry_tracking ?? false,
      is_active: createDto.is_active ?? true,
    });
    return await this.ingredientRepository.save(ingredient);
  }

  async updateIngredient(id: string, updateDto: Partial<CreateIngredientDto>): Promise<IngredientEntity> {
    const ingredient = await this.findIngredientById(id);
    Object.assign(ingredient, updateDto);
    return await this.ingredientRepository.save(ingredient);
  }

  async deleteIngredient(id: string): Promise<void> {
    const ingredient = await this.findIngredientById(id);
    await this.ingredientRepository.softRemove(ingredient);
  }

  async getIngredientStatistics(shopId?: string): Promise<any> {
    const queryBuilder = this.ingredientRepository.createQueryBuilder('ingredient');

    if (shopId) {
      queryBuilder.where('ingredient.shop_id = :shopId', { shopId });
    }
    queryBuilder.andWhere('ingredient.deleted_at IS NULL');

    // Stock status distribution
    const stockStatusQuery = await queryBuilder
      .select(
        `CASE 
          WHEN ingredient.current_stock > ingredient.min_stock_level THEN 'Đủ hàng'
          WHEN ingredient.current_stock > 0 THEN 'Sắp hết'
          ELSE 'Hết hàng'
        END`,
        'status',
      )
      .addSelect('COUNT(*)', 'count')
      .groupBy('status')
      .getRawMany();

    // Unit distribution
    const unitDistribution = await queryBuilder
      .select('ingredient.unit', 'unit')
      .addSelect('COUNT(*)', 'count')
      .groupBy('ingredient.unit')
      .getRawMany();

    // Total counts
    const totalIngredients = await queryBuilder.getCount();

    const sufficientStock = await this.ingredientRepository
      .createQueryBuilder('ingredient')
      .where(shopId ? 'ingredient.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('ingredient.current_stock > ingredient.min_stock_level')
      .andWhere('ingredient.deleted_at IS NULL')
      .getCount();

    const lowStock = await this.ingredientRepository
      .createQueryBuilder('ingredient')
      .where(shopId ? 'ingredient.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('ingredient.current_stock <= ingredient.min_stock_level')
      .andWhere('ingredient.current_stock > 0')
      .andWhere('ingredient.deleted_at IS NULL')
      .getCount();

    const outOfStock = await this.ingredientRepository
      .createQueryBuilder('ingredient')
      .where(shopId ? 'ingredient.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('ingredient.current_stock = 0')
      .andWhere('ingredient.deleted_at IS NULL')
      .getCount();

    // Total inventory value
    const inventoryValueResult = await queryBuilder
      .select('SUM(ingredient.current_stock * ingredient.unit_price)', 'total')
      .getRawOne();

    const totalInventoryValue = parseFloat(inventoryValueResult?.total || '0');

    return {
      stockStatusDistribution: stockStatusQuery.map((item) => ({
        status: item.status,
        count: parseInt(item.count, 10),
      })),
      unitDistribution: unitDistribution.map((item) => ({
        unit: item.unit,
        count: parseInt(item.count, 10),
      })),
      totalIngredients,
      sufficientStock,
      lowStock,
      outOfStock,
      totalInventoryValue,
    };
  }

  // Inventory Transactions
  async findAllTransactions(pagination: PaginationDto & { ingredient_id?: string; transaction_type?: string }): Promise<PaginatedResponseDto<InventoryTransactionEntity>> {
    const { page = 1, limit = 10, ingredient_id, transaction_type } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.ingredient', 'ingredient')
      .leftJoinAndSelect('transaction.creator', 'creator');

    if (ingredient_id) {
      queryBuilder.andWhere('transaction.ingredient_id = :ingredient_id', { ingredient_id });
    }

    if (transaction_type) {
      queryBuilder.andWhere('transaction.transaction_type = :transaction_type', { transaction_type });
    }

    queryBuilder.orderBy('transaction.created_at', 'DESC').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findTransactionById(id: string): Promise<InventoryTransactionEntity> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['ingredient', 'creator'],
    });
    if (!transaction) {
      throw new NotFoundException(`Inventory transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async createTransaction(createDto: any): Promise<InventoryTransactionEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ingredient = await this.ingredientRepository.findOne({ where: { id: createDto.ingredient_id } });
      if (!ingredient) {
        throw new NotFoundException(`Ingredient with ID ${createDto.ingredient_id} not found`);
      }

      // Validate out transactions
      if (createDto.transaction_type === 'out' || createDto.transaction_type === 'auto_deduct') {
        if (Number(ingredient.current_stock) < Number(createDto.quantity)) {
          throw new BadRequestException('Insufficient stock');
        }
      }

      const totalAmount = createDto.unit_price ? Number(createDto.unit_price) * Number(createDto.quantity) : null;

      const transaction = this.transactionRepository.create({
        ...createDto,
        total_amount: totalAmount,
      });

      const savedResult = await queryRunner.manager.save(transaction);
      const savedTransaction = Array.isArray(savedResult) ? savedResult[0] : savedResult;

      // Update ingredient stock
      if (createDto.transaction_type === 'in') {
        ingredient.current_stock = Number(ingredient.current_stock) + Number(createDto.quantity);
      } else if (createDto.transaction_type === 'out' || createDto.transaction_type === 'auto_deduct') {
        ingredient.current_stock = Number(ingredient.current_stock) - Number(createDto.quantity);
      }

      await queryRunner.manager.save(ingredient);

      await queryRunner.commitTransaction();

      return await this.findTransactionById(savedTransaction.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactionStatistics(shopId?: string): Promise<any> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction');

    if (shopId) {
      queryBuilder.where('transaction.shop_id = :shopId', { shopId });
    }

    // Type distribution
    const typeDistribution = await queryBuilder
      .select('transaction.transaction_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('transaction.transaction_type')
      .getRawMany();

    // Reason distribution (for out transactions)
    const reasonDistribution = await queryBuilder
      .select('transaction.reason', 'reason')
      .addSelect('COUNT(*)', 'count')
      .where('transaction.transaction_type = :type', { type: 'out' })
      .andWhere(shopId ? 'transaction.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .groupBy('transaction.reason')
      .getRawMany();

    // This month's statistics
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthQuery = this.transactionRepository.createQueryBuilder('transaction');
    if (shopId) {
      thisMonthQuery.where('transaction.shop_id = :shopId', { shopId });
    }
    thisMonthQuery.andWhere('transaction.created_at >= :startOfMonth', { startOfMonth });

    const totalTransactionsThisMonth = await thisMonthQuery.getCount();

    const inValueResult = await thisMonthQuery
      .select('SUM(transaction.total_amount)', 'total')
      .where('transaction.transaction_type = :type', { type: 'in' })
      .getRawOne();

    const totalInValueThisMonth = parseFloat(inValueResult?.total || '0');

    const outValueResult = await thisMonthQuery
      .select('SUM(transaction.total_amount)', 'total')
      .where('transaction.transaction_type = :type', { type: 'out' })
      .getRawOne();

    const totalOutValueThisMonth = parseFloat(outValueResult?.total || '0');

    return {
      typeDistribution: typeDistribution.map((item) => ({
        type: item.type,
        count: parseInt(item.count, 10),
      })),
      reasonDistribution: reasonDistribution.map((item) => ({
        reason: item.reason || 'Unknown',
        count: parseInt(item.count, 10),
      })),
      totalTransactionsThisMonth,
      totalInValueThisMonth,
      totalOutValueThisMonth,
    };
  }
}

