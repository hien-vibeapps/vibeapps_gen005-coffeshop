import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  Check,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { EmployeeEntity } from './employee.entity';

@Entity('payment')
@Unique(['receipt_number'])
@Index(['order_id'])
@Index(['processed_by', 'processed_at'])
@Check(`"amount" > 0`)
@Check(`"payment_method" IN ('cash', 'card', 'bank_transfer', 'e_wallet')`)
@Check(`"received_amount" >= "amount" OR "received_amount" IS NULL`)
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'order_id' })
  order?: OrderEntity;

  @Column({ type: 'varchar', length: 20 })
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'e_wallet';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  received_amount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  change_amount?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transaction_id?: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  receipt_number: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid' })
  processed_by: string;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'processed_by' })
  processor?: EmployeeEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  processed_at: Date;

  @CreateDateColumn()
  created_at: Date;
}

