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
import { ProductOptionGroupEntity } from './product-option-group.entity';

@Entity('product_option')
@Unique(['option_group_id', 'name'])
@Index(['option_group_id', 'display_order'])
@Check(`"price_adjustment" >= -9999999.99 AND "price_adjustment" <= 9999999.99`)
export class ProductOptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  option_group_id: string;

  @ManyToOne(() => ProductOptionGroupEntity, (group) => group.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'option_group_id' })
  option_group?: ProductOptionGroupEntity;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price_adjustment: number;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}

