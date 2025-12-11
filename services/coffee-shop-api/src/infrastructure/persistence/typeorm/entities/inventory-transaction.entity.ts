import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { ShopEntity } from './shop.entity';
import { IngredientEntity } from './ingredient.entity';
import { EmployeeEntity } from './employee.entity';

@Entity('inventory_transaction')
@Index(['shop_id', 'ingredient_id', 'created_at'])
@Index(['shop_id', 'transaction_type', 'created_at'])
@Index(['reference_id', 'reference_type'])
@Check(`"transaction_type" IN ('in', 'out', 'auto_deduct')`)
@Check(`"quantity" > 0`)
export class InventoryTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  shop_id: string;

  @ManyToOne(() => ShopEntity)
  @JoinColumn({ name: 'shop_id' })
  shop?: ShopEntity;

  @Column({ type: 'uuid' })
  ingredient_id: string;

  @ManyToOne(() => IngredientEntity)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient?: IngredientEntity;

  @Column({ type: 'varchar', length: 20 })
  transaction_type: 'in' | 'out' | 'auto_deduct';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unit_price?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_amount?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reason?: string;

  @Column({ type: 'uuid', nullable: true })
  reference_id?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  reference_type?: string;

  @Column({ type: 'date', nullable: true })
  expiry_date?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'created_by' })
  creator?: EmployeeEntity;

  @CreateDateColumn()
  created_at: Date;
}

