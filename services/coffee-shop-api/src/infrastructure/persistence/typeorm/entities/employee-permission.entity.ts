import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { EmployeeEntity } from './employee.entity';

@Entity('employee_permission')
@Unique(['employee_id', 'permission_code'])
@Index(['employee_id'])
export class EmployeePermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  employee_id: string;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee?: EmployeeEntity;

  @Column({ type: 'varchar', length: 50 })
  permission_code: string;

  @Column({ type: 'boolean', default: true })
  is_granted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

