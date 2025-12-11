import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductOptionEntity } from './product-option.entity';

@Entity('product_option_group')
@Index(['product_id', 'display_order'])
@Check(`"max_selections" >= 1`)
export class ProductOptionGroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @ManyToOne(() => ProductEntity, (product) => product.option_groups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product?: ProductEntity;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'boolean', default: false })
  is_required: boolean;

  @Column({ type: 'int', default: 1 })
  max_selections: number;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @OneToMany(() => ProductOptionEntity, (option) => option.option_group, { cascade: true })
  options?: ProductOptionEntity[];

  @CreateDateColumn()
  created_at: Date;
}

