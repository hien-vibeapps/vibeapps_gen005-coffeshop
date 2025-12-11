import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeEntity } from '../../../infrastructure/persistence/typeorm/entities/employee.entity';
import { EmployeePermissionEntity } from '../../../infrastructure/persistence/typeorm/entities/employee-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity, EmployeePermissionEntity])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}

