import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  Check,
} from 'typeorm';
import { AreaEntity } from './area.entity';

@Entity('table')
@Unique(['area_id', 'table_number'])
@Index(['area_id', 'status', 'is_active'])
@Check(`"capacity" > 0 AND "capacity" <= 50`)
@Check(`"status" IN ('available', 'occupied', 'reserved', 'maintenance')`)
export class TableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  area_id: string;

  @ManyToOne(() => AreaEntity, (area) => area.tables)
  @JoinColumn({ name: 'area_id' })
  area?: AreaEntity;

  @Column({ type: 'varchar', length: 20 })
  table_number: string;

  @Column({ type: 'int', default: 4 })
  capacity: number;

  @Column({ type: 'varchar', length: 20, default: 'available' })
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  position_x?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  position_y?: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}

