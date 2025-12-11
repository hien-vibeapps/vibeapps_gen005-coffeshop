import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Check,
} from 'typeorm';

@Entity('shop')
@Check(`"closing_time" > "opening_time"`)
@Check(`"vat_rate" >= 0 AND "vat_rate" <= 100`)
@Check(`"service_fee_rate" >= 0 AND "service_fee_rate" <= 100`)
export class ShopEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url?: string;

  @Column({ type: 'time', nullable: true })
  opening_time?: string;

  @Column({ type: 'time', nullable: true })
  closing_time?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  facebook?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagram?: string;

  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @Column({ type: 'varchar', length: 50, default: 'Asia/Ho_Chi_Minh' })
  timezone: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10.0 })
  vat_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  service_fee_rate: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}

