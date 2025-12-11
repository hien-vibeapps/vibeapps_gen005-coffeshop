import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../../../infrastructure/persistence/typeorm/entities/payment.entity';
import { OrderEntity } from '../../../infrastructure/persistence/typeorm/entities/order.entity';
import { CreatePaymentDto } from '../../../application/dto/payment/create-payment.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async findAll(pagination: PaginationDto & { order_id?: string; payment_method?: string; shop_id?: string }): Promise<PaginatedResponseDto<PaymentEntity>> {
    const { page = 1, limit = 10, search, sort, order = 'desc', order_id, payment_method, shop_id } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order');

    if (shop_id) {
      queryBuilder.leftJoin('order', 'order_shop', 'order.id = payment.order_id').where('order_shop.shop_id = :shop_id', { shop_id });
    }

    if (order_id) {
      queryBuilder.andWhere('payment.order_id = :order_id', { order_id });
    }

    if (payment_method) {
      queryBuilder.andWhere('payment.payment_method = :payment_method', { payment_method });
    }

    if (search) {
      queryBuilder.andWhere(
        '(payment.receipt_number ILIKE :search OR payment.transaction_id ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      queryBuilder.orderBy(`payment.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('payment.created_at', 'DESC');
    }

    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findById(id: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async create(createDto: CreatePaymentDto): Promise<PaymentEntity> {
    const order = await this.orderRepository.findOne({ where: { id: createDto.order_id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${createDto.order_id} not found`);
    }

    if (order.status === 'paid') {
      throw new BadRequestException('Order is already paid');
    }

    // Generate receipt number
    const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate change amount for cash payments
    let changeAmount = 0;
    if (createDto.payment_method === 'cash' && createDto.received_amount) {
      changeAmount = createDto.received_amount - createDto.amount;
      if (changeAmount < 0) {
        throw new BadRequestException('Received amount is less than payment amount');
      }
    }

    const payment = this.paymentRepository.create({
      ...createDto,
      receipt_number: receiptNumber,
      change_amount: changeAmount,
      processed_by: 'system', // TODO: Get from authenticated user
      processed_at: new Date(),
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Update order status to paid
    order.status = 'paid';
    order.paid_at = new Date();
    await this.orderRepository.save(order);

    return savedPayment;
  }

  async getStatistics(shopId?: string): Promise<any> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');

    if (shopId) {
      queryBuilder
        .leftJoin('order', 'order', 'order.id = payment.order_id')
        .where('order.shop_id = :shopId', { shopId });
    }

    // Method distribution
    const methodDistribution = await queryBuilder
      .select('payment.payment_method', 'method')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payment.payment_method')
      .getRawMany();

    // Status distribution (based on order payment status)
    const statusQuery = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoin('order', 'order', 'order.id = payment.order_id')
      .select(
        `CASE 
          WHEN SUM(payment.amount) >= order.total_amount THEN 'Paid'
          ELSE 'Partial'
        END`,
        'status',
      )
      .addSelect('COUNT(*)', 'count')
      .where(shopId ? 'order.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .groupBy('order.id')
      .addGroupBy('order.total_amount');

    // For simplicity, we'll use a different approach
    const paidPayments = await queryBuilder
      .leftJoin('order', 'order', 'order.id = payment.order_id')
      .where(shopId ? 'order.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .getCount();

    // Today's statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayQuery = this.paymentRepository.createQueryBuilder('payment');
    if (shopId) {
      todayQuery
        .leftJoin('order', 'order', 'order.id = payment.order_id')
        .where('order.shop_id = :shopId', { shopId });
    }
    todayQuery.andWhere('payment.processed_at >= :today', { today });
    todayQuery.andWhere('payment.processed_at < :tomorrow', { tomorrow });

    const totalTransactionsToday = await todayQuery.getCount();

    const todayAmountResult = await todayQuery
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    const totalAmountToday = parseFloat(todayAmountResult?.total || '0');

    return {
      methodDistribution: methodDistribution.map((item) => ({
        method: item.method,
        count: parseInt(item.count, 10),
      })),
      statusDistribution: [
        { status: 'Paid', count: paidPayments },
        { status: 'Partial', count: 0 }, // TODO: Calculate partial payments
      ],
      totalTransactionsToday,
      totalAmountToday,
    };
  }
}

