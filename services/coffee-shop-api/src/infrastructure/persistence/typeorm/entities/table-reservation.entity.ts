import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { ShopEntity } from './shop.entity';
import { TableEntity } from './table.entity';
import { EmployeeEntity } from './employee.entity';

@Entity('table_reservation')
@Index(['shop_id', 'reservation_time', 'status'])
@Index(['table_id', 'reservation_time', 'status'])
@Check(`"number_of_guests" > 0 AND "number_of_guests" <= 50`)
@Check(`"status" IN ('pending', 'confirmed', 'cancelled', 'completed')`)
export class TableReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  shop_id: string;

  @ManyToOne(() => ShopEntity)
  @JoinColumn({ name: 'shop_id' })
  shop?: ShopEntity;

  @Column({ type: 'uuid', nullable: true })
  table_id?: string;

  @ManyToOne(() => TableEntity)
  @JoinColumn({ name: 'table_id' })
  table?: TableEntity;

  @Column({ type: 'varchar', length: 100 })
  customer_name: string;

  @Column({ type: 'varchar', length: 20 })
  customer_phone: string;

  @Column({ type: 'timestamp' })
  reservation_time: Date;

  @Column({ type: 'int' })
  number_of_guests: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'created_by' })
  creator?: EmployeeEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at?: Date;

  @Column({ type: 'text', nullable: true })
  cancelled_reason?: string;
}

