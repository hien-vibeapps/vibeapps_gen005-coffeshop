import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderEntity } from '../../../infrastructure/persistence/typeorm/entities/order.entity';
import { OrderItemEntity } from '../../../infrastructure/persistence/typeorm/entities/order-item.entity';
import { ProductEntity } from '../../../infrastructure/persistence/typeorm/entities/product.entity';
import { ShopEntity } from '../../../infrastructure/persistence/typeorm/entities/shop.entity';
import { CreateOrderDto } from '../../../application/dto/order/create-order.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ShopEntity)
    private shopRepository: Repository<ShopEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(pagination: PaginationDto & {
    status?: string;
    order_type?: string;
    table_id?: string;
    created_by?: string;
    shop_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponseDto<OrderEntity>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort,
      order = 'desc',
      status,
      order_type,
      table_id,
      created_by,
      shop_id,
      start_date,
      end_date,
    } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.shop', 'shop')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (shop_id) {
      queryBuilder.where('order.shop_id = :shop_id', { shop_id });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (order_type) {
      queryBuilder.andWhere('order.order_type = :order_type', { order_type });
    }

    if (table_id) {
      queryBuilder.andWhere('order.table_id = :table_id', { table_id });
    }

    if (created_by) {
      queryBuilder.andWhere('order.created_by = :created_by', { created_by });
    }

    if (start_date) {
      queryBuilder.andWhere('order.created_at >= :start_date', { start_date: new Date(start_date) });
    }

    if (end_date) {
      queryBuilder.andWhere('order.created_at <= :end_date', { end_date: new Date(end_date) });
    }

    if (search) {
      queryBuilder.andWhere(
        '(order.order_number ILIKE :search OR order.customer_name ILIKE :search OR order.customer_phone ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      queryBuilder.orderBy(`order.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('order.created_at', 'DESC');
    }

    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findById(id: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['shop', 'table', 'items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async create(createDto: CreateOrderDto): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get shop for VAT and service fee rates
      const shop = await this.shopRepository.findOne({ where: { id: createDto.shop_id } });
      if (!shop) {
        throw new NotFoundException(`Shop with ID ${createDto.shop_id} not found`);
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Calculate order totals
      let subtotal = 0;
      const orderItems: OrderItemEntity[] = [];

      for (const itemDto of createDto.items) {
        const product = await this.productRepository.findOne({ where: { id: itemDto.product_id } });
        if (!product) {
          throw new NotFoundException(`Product with ID ${itemDto.product_id} not found`);
        }

        // Calculate unit price (base price + option adjustments)
        let unitPrice = Number(product.price);
        if (itemDto.selected_options) {
          // Add option price adjustments here if needed
        }

        const itemSubtotal = unitPrice * itemDto.quantity;
        subtotal += itemSubtotal;

        const orderItem = this.orderItemRepository.create({
          product_id: itemDto.product_id,
          product_name: product.name,
          product_price: Number(product.price),
          quantity: itemDto.quantity,
          unit_price: unitPrice,
          subtotal: itemSubtotal,
          selected_options: itemDto.selected_options,
          notes: itemDto.notes,
          status: 'pending',
        });
        orderItems.push(orderItem);
      }

      const deliveryFee = createDto.delivery_fee ?? 0;
      const vatAmount = (subtotal + deliveryFee) * (shop.vat_rate / 100);
      const serviceFee = (subtotal + deliveryFee) * (shop.service_fee_rate / 100);
      const totalAmount = subtotal + deliveryFee + vatAmount + serviceFee;

      // Create order
      const order = this.orderRepository.create({
        shop_id: createDto.shop_id,
        order_number: orderNumber,
        table_id: createDto.table_id,
        order_type: createDto.order_type,
        customer_name: createDto.customer_name,
        customer_phone: createDto.customer_phone,
        delivery_address: createDto.delivery_address,
        delivery_fee: deliveryFee,
        subtotal,
        vat_amount: vatAmount,
        service_fee: serviceFee,
        total_amount: totalAmount,
        status: 'pending',
        notes: createDto.notes,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Save order items
      for (const item of orderItems) {
        item.order_id = savedOrder.id;
        await queryRunner.manager.save(item);
      }

      await queryRunner.commitTransaction();

      return await this.findById(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateDto: Partial<CreateOrderDto>): Promise<OrderEntity> {
    const order = await this.findById(id);
    Object.assign(order, updateDto);
    return await this.orderRepository.save(order);
  }

  async cancel(id: string, reason: string): Promise<OrderEntity> {
    const order = await this.findById(id);
    if (order.status === 'cancelled') {
      throw new BadRequestException('Order is already cancelled');
    }
    if (order.status === 'paid') {
      throw new BadRequestException('Cannot cancel paid order');
    }
    order.status = 'cancelled';
    order.cancelled_reason = reason;
    order.cancelled_at = new Date();
    return await this.orderRepository.save(order);
  }

  async updateStatus(id: string, status: OrderEntity['status']): Promise<OrderEntity> {
    const order = await this.findById(id);
    order.status = status;
    if (status === 'paid') {
      order.paid_at = new Date();
    }
    return await this.orderRepository.save(order);
  }

  async getStatistics(shopId?: string): Promise<any> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    if (shopId) {
      queryBuilder.where('order.shop_id = :shopId', { shopId });
    }

    // Status distribution
    const statusDistribution = await queryBuilder
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    // Type distribution
    const typeDistribution = await queryBuilder
      .select('order.order_type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.order_type')
      .getRawMany();

    // Today's statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayQuery = this.orderRepository.createQueryBuilder('order');
    if (shopId) {
      todayQuery.where('order.shop_id = :shopId', { shopId });
    }
    todayQuery.andWhere('order.created_at >= :today', { today });
    todayQuery.andWhere('order.created_at < :tomorrow', { tomorrow });

    const totalOrdersToday = await todayQuery.getCount();

    const todayRevenueResult = await todayQuery
      .select('SUM(order.total_amount)', 'total')
      .where('order.status = :status', { status: 'paid' })
      .getRawOne();

    const totalRevenueToday = parseFloat(todayRevenueResult?.total || '0');

    const pendingOrders = await this.orderRepository
      .createQueryBuilder('order')
      .where(shopId ? 'order.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('order.status = :status', { status: 'pending' })
      .getCount();

    const ordersAwaitingPayment = await this.orderRepository
      .createQueryBuilder('order')
      .where(shopId ? 'order.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('order.status = :status', { status: 'served' })
      .getCount();

    return {
      statusDistribution: statusDistribution.map((item) => ({
        status: item.status,
        count: parseInt(item.count, 10),
      })),
      typeDistribution: typeDistribution.map((item) => ({
        type: item.type,
        count: parseInt(item.count, 10),
      })),
      totalOrdersToday,
      totalRevenueToday,
      pendingOrders,
      ordersAwaitingPayment,
    };
  }
}

