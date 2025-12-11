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
import { ShopEntity } from './shop.entity';

@Entity('ingredient')
@Unique(['shop_id', 'name'])
@Index(['shop_id', 'is_active'])
@Index(['shop_id', 'current_stock', 'min_stock_level'])
@Check(`"current_stock" >= 0`)
@Check(`"min_stock_level" >= 0`)
@Check(`"unit_price" >= 0`)
export class IngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  shop_id: string;

  @ManyToOne(() => ShopEntity)
  @JoinColumn({ name: 'shop_id' })
  shop?: ShopEntity;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  current_stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  min_stock_level: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  unit_price: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  supplier?: string;

  @Column({ type: 'boolean', default: false })
  expiry_tracking: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}

