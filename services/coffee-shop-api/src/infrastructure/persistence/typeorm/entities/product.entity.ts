import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
  Check,
} from 'typeorm';
import { ShopEntity } from './shop.entity';
import { CategoryEntity } from './category.entity';
import { ProductImageEntity } from './product-image.entity';
import { ProductOptionGroupEntity } from './product-option-group.entity';

@Entity('product')
@Unique(['shop_id', 'category_id', 'name'])
@Index(['shop_id', 'category_id', 'is_active', 'status'])
@Index(['shop_id', 'display_order'])
@Check(`"price" > 0`)
@Check(`"estimated_prep_time" >= 0 AND "estimated_prep_time" <= 120`)
@Check(`"status" IN ('available', 'out_of_stock', 'suspended')`)
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  shop_id: string;

  @ManyToOne(() => ShopEntity)
  @JoinColumn({ name: 'shop_id' })
  shop?: ShopEntity;

  @Column({ type: 'uuid' })
  category_id: string;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category?: CategoryEntity;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  estimated_prep_time: number;

  @Column({ type: 'varchar', length: 20, default: 'available' })
  status: 'available' | 'out_of_stock' | 'suspended';

  @Column({ type: 'int', nullable: true })
  calories?: number;

  @Column({ type: 'text', nullable: true })
  allergen_info?: string;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => ProductImageEntity, (image) => image.product, { cascade: true })
  images?: ProductImageEntity[];

  @OneToMany(() => ProductOptionGroupEntity, (group) => group.product, { cascade: true })
  option_groups?: ProductOptionGroupEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}

