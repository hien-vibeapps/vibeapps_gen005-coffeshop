import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { OrderEntity } from '../../../infrastructure/persistence/typeorm/entities/order.entity';
import { OrderItemEntity } from '../../../infrastructure/persistence/typeorm/entities/order-item.entity';
import { PaymentEntity } from '../../../infrastructure/persistence/typeorm/entities/payment.entity';
import { IngredientEntity } from '../../../infrastructure/persistence/typeorm/entities/ingredient.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(IngredientEntity)
    private ingredientRepository: Repository<IngredientEntity>,
  ) {}

  async getRevenueReport(startDate: string, endDate: string, groupBy?: 'day' | 'week' | 'month') {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const orders = await this.orderRepository.find({
      where: {
        created_at: Between(start, end),
        status: 'paid',
      },
      relations: ['items'],
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue by payment method
    const payments = await this.paymentRepository.find({
      where: {
        processed_at: Between(start, end),
      },
    });

    const revenueByPaymentMethod = payments.reduce((acc, payment) => {
      const method = payment.payment_method;
      acc[method] = (acc[method] || 0) + Number(payment.amount);
      return acc;
    }, {} as Record<string, number>);

    // Revenue by category (simplified - would need proper category aggregation)
    const revenueByCategory: Record<string, number> = {};

    return {
      period: `${startDate} to ${endDate}`,
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      average_order_value: averageOrderValue,
      revenue_by_payment_method: revenueByPaymentMethod,
      revenue_by_category: revenueByCategory,
    };
  }

  async getSalesReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const orderItems = await this.orderItemRepository.find({
      where: {
        created_at: Between(start, end),
      },
      relations: ['product', 'order'],
    });

    // Group by product
    const productSales = orderItems.reduce((acc, item) => {
      const productId = item.product_id;
      if (!acc[productId]) {
        acc[productId] = {
          product_id: productId,
          product_name: item.product_name,
          quantity_sold: 0,
          revenue: 0,
        };
      }
      acc[productId].quantity_sold += item.quantity;
      acc[productId].revenue += Number(item.subtotal);
      return acc;
    }, {} as Record<string, any>);

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      period: `${startDate} to ${endDate}`,
      top_products: topProducts,
      sales_by_category: {},
      sales_trend: [],
    };
  }

  async getInventoryReport() {
    const ingredients = await this.ingredientRepository.find({
      where: { is_active: true },
    });

    const lowStockItems = ingredients.filter(
      (ingredient) => ingredient.current_stock <= ingredient.min_stock_level,
    );

    const totalInventoryValue = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.current_stock * Number(ingredient.unit_price),
      0,
    );

    return {
      total_ingredients: ingredients.length,
      low_stock_items: lowStockItems,
      total_inventory_value: totalInventoryValue,
      inventory_by_category: {},
    };
  }
}

