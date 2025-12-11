import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
  Check,
} from 'typeorm';
import { ShopEntity } from './shop.entity';
import { TableEntity } from './table.entity';
import { EmployeeEntity } from './employee.entity';
import { OrderItemEntity } from './order-item.entity';

@Entity('order')
@Unique(['order_number'])
@Index(['shop_id', 'status', 'created_at'])
@Index(['shop_id', 'table_id', 'status'])
@Index(['shop_id', 'created_at'])
@Index(['created_by', 'created_at'])
@Check(`"order_type" IN ('dine_in', 'takeaway', 'delivery')`)
@Check(`"status" IN ('pending', 'preparing', 'ready', 'served', 'paid', 'cancelled')`)
@Check(`"subtotal" >= 0`)
@Check(`"vat_amount" >= 0`)
@Check(`"service_fee" >= 0`)
@Check(`"delivery_fee" >= 0`)
@Check(`"total_amount" >= 0`)
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  shop_id: string;

  @ManyToOne(() => ShopEntity)
  @JoinColumn({ name: 'shop_id' })
  shop?: ShopEntity;

  @Column({ type: 'varchar', length: 50, unique: true })
  order_number: string;

  @Column({ type: 'uuid', nullable: true })
  table_id?: string;

  @ManyToOne(() => TableEntity)
  @JoinColumn({ name: 'table_id' })
  table?: TableEntity;

  @Column({ type: 'varchar', length: 20, default: 'dine_in' })
  order_type: 'dine_in' | 'takeaway' | 'delivery';

  @Column({ type: 'varchar', length: 100, nullable: true })
  customer_name?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  customer_phone?: string;

  @Column({ type: 'text', nullable: true })
  delivery_address?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  delivery_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  vat_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  service_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'created_by' })
  creator?: EmployeeEntity;

  @Column({ type: 'uuid', nullable: true })
  served_by?: string;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'served_by' })
  server?: EmployeeEntity;

  @Column({ type: 'uuid', nullable: true })
  cancelled_by?: string;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'cancelled_by' })
  canceller?: EmployeeEntity;

  @Column({ type: 'text', nullable: true })
  cancelled_reason?: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items?: OrderItemEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  paid_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at?: Date;
}

