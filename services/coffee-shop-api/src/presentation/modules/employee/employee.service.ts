import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEntity } from '../../../infrastructure/persistence/typeorm/entities/employee.entity';
import { EmployeePermissionEntity } from '../../../infrastructure/persistence/typeorm/entities/employee-permission.entity';
import { CreateEmployeeDto } from '../../../application/dto/employee/create-employee.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(EmployeePermissionEntity)
    private permissionRepository: Repository<EmployeePermissionEntity>,
  ) {}

  async findAll(pagination: PaginationDto & { role?: string; is_active?: boolean; shop_id?: string }): Promise<PaginatedResponseDto<EmployeeEntity>> {
    const { page = 1, limit = 10, search, sort, order = 'desc', role, is_active, shop_id } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.shop', 'shop');

    if (shop_id) {
      queryBuilder.where('employee.shop_id = :shop_id', { shop_id });
    }

    if (role) {
      queryBuilder.andWhere('employee.role = :role', { role });
    }

    if (is_active !== undefined) {
      queryBuilder.andWhere('employee.is_active = :is_active', { is_active });
    }

    if (search) {
      queryBuilder.andWhere(
        '(employee.full_name ILIKE :search OR employee.email ILIKE :search OR employee.phone ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      queryBuilder.orderBy(`employee.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('employee.created_at', 'DESC');
    }

    queryBuilder.andWhere('employee.deleted_at IS NULL').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findById(id: string): Promise<EmployeeEntity> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['shop'],
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async create(createDto: CreateEmployeeDto): Promise<EmployeeEntity> {
    const employee = this.employeeRepository.create({
      ...createDto,
      is_active: createDto.is_active ?? true,
    });
    return await this.employeeRepository.save(employee);
  }

  async update(id: string, updateDto: Partial<CreateEmployeeDto>): Promise<EmployeeEntity> {
    const employee = await this.findById(id);
    Object.assign(employee, updateDto);
    return await this.employeeRepository.save(employee);
  }

  async delete(id: string): Promise<void> {
    const employee = await this.findById(id);
    await this.employeeRepository.softRemove(employee);
  }

  async getStatistics(shopId?: string): Promise<any> {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');

    if (shopId) {
      queryBuilder.where('employee.shop_id = :shopId', { shopId });
    }
    queryBuilder.andWhere('employee.deleted_at IS NULL');

    // Status distribution
    const statusDistribution = await queryBuilder
      .select('employee.is_active', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('employee.is_active')
      .getRawMany();

    // Role distribution
    const roleDistribution = await queryBuilder
      .select('employee.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('employee.role')
      .getRawMany();

    // Total counts
    const totalEmployees = await queryBuilder.getCount();

    const activeEmployees = await this.employeeRepository
      .createQueryBuilder('employee')
      .where(shopId ? 'employee.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('employee.is_active = :isActive', { isActive: true })
      .andWhere('employee.deleted_at IS NULL')
      .getCount();

    // New employees this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newEmployeesThisMonth = await this.employeeRepository
      .createQueryBuilder('employee')
      .where(shopId ? 'employee.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('employee.created_at >= :startOfMonth', { startOfMonth })
      .andWhere('employee.deleted_at IS NULL')
      .getCount();

    return {
      statusDistribution: statusDistribution.map((item) => ({
        status: item.status ? 'Active' : 'Inactive',
        count: parseInt(item.count, 10),
      })),
      roleDistribution: roleDistribution.map((item) => ({
        role: item.role,
        count: parseInt(item.count, 10),
      })),
      totalEmployees,
      activeEmployees,
      newEmployeesThisMonth,
    };
  }

  // Employee Permissions
  async getEmployeePermissions(employeeId: string): Promise<EmployeePermissionEntity[]> {
    const employee = await this.findById(employeeId);
    return await this.permissionRepository.find({
      where: { employee_id: employeeId },
      order: { permission_code: 'ASC' },
    });
  }

  async updateEmployeePermissions(
    employeeId: string,
    permissions: { permission_code: string; is_granted: boolean }[],
  ): Promise<EmployeePermissionEntity[]> {
    const employee = await this.findById(employeeId);

    // Delete existing permissions
    await this.permissionRepository.delete({ employee_id: employeeId });

    // Create new permissions
    const permissionEntities = permissions.map((perm) =>
      this.permissionRepository.create({
        employee_id: employeeId,
        permission_code: perm.permission_code,
        is_granted: perm.is_granted,
      }),
    );

    return await this.permissionRepository.save(permissionEntities);
  }
}

