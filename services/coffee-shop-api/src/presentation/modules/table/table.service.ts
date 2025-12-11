import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaEntity } from '../../../infrastructure/persistence/typeorm/entities/area.entity';
import { TableEntity } from '../../../infrastructure/persistence/typeorm/entities/table.entity';
import { TableReservationEntity } from '../../../infrastructure/persistence/typeorm/entities/table-reservation.entity';
import { CreateAreaDto } from '../../../application/dto/table/create-area.dto';
import { CreateTableDto } from '../../../application/dto/table/create-table.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(AreaEntity)
    private areaRepository: Repository<AreaEntity>,
    @InjectRepository(TableEntity)
    private tableRepository: Repository<TableEntity>,
    @InjectRepository(TableReservationEntity)
    private reservationRepository: Repository<TableReservationEntity>,
  ) {}

  // Areas
  async findAllAreas(pagination: PaginationDto & { shop_id?: string }): Promise<PaginatedResponseDto<AreaEntity>> {
    const { page = 1, limit = 10, search, sort, order = 'desc', shop_id } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.areaRepository.createQueryBuilder('area');

    if (shop_id) {
      queryBuilder.where('area.shop_id = :shop_id', { shop_id });
    }

    if (search) {
      queryBuilder.andWhere('(area.name ILIKE :search OR area.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (sort) {
      queryBuilder.orderBy(`area.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('area.created_at', 'DESC');
    }

    queryBuilder.andWhere('area.deleted_at IS NULL').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findAreaById(id: string): Promise<AreaEntity> {
    const area = await this.areaRepository.findOne({ where: { id } });
    if (!area) {
      throw new NotFoundException(`Area with ID ${id} not found`);
    }
    return area;
  }

  async createArea(createDto: CreateAreaDto): Promise<AreaEntity> {
    const area = this.areaRepository.create({
      ...createDto,
      is_active: createDto.is_active ?? true,
    });
    return await this.areaRepository.save(area);
  }

  async updateArea(id: string, updateDto: Partial<CreateAreaDto>): Promise<AreaEntity> {
    const area = await this.findAreaById(id);
    Object.assign(area, updateDto);
    return await this.areaRepository.save(area);
  }

  async deleteArea(id: string): Promise<void> {
    const area = await this.findAreaById(id);
    await this.areaRepository.softRemove(area);
  }

  // Tables
  async findAllTables(pagination: PaginationDto & { area_id?: string; status?: string }): Promise<PaginatedResponseDto<TableEntity>> {
    const { page = 1, limit = 10, search, sort, order = 'desc', area_id, status } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.tableRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect('table.area', 'area');

    if (area_id) {
      queryBuilder.where('table.area_id = :area_id', { area_id });
    }

    if (status) {
      queryBuilder.andWhere('table.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere('(table.table_number ILIKE :search OR table.notes ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (sort) {
      queryBuilder.orderBy(`table.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('table.created_at', 'DESC');
    }

    queryBuilder.andWhere('table.deleted_at IS NULL').skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findTableById(id: string): Promise<TableEntity> {
    const table = await this.tableRepository.findOne({
      where: { id },
      relations: ['area'],
    });
    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }
    return table;
  }

  async createTable(createDto: CreateTableDto): Promise<TableEntity> {
    const table = this.tableRepository.create({
      ...createDto,
      capacity: createDto.capacity ?? 4,
      status: createDto.status ?? 'available',
      is_active: createDto.is_active ?? true,
    });
    return await this.tableRepository.save(table);
  }

  async updateTable(id: string, updateDto: Partial<CreateTableDto>): Promise<TableEntity> {
    const table = await this.findTableById(id);
    Object.assign(table, updateDto);
    return await this.tableRepository.save(table);
  }

  async deleteTable(id: string): Promise<void> {
    const table = await this.findTableById(id);
    await this.tableRepository.softRemove(table);
  }

  // Statistics
  async getAreaStatistics(shopId?: string): Promise<any> {
    const queryBuilder = this.areaRepository.createQueryBuilder('area');

    if (shopId) {
      queryBuilder.where('area.shop_id = :shopId', { shopId });
    }
    queryBuilder.andWhere('area.deleted_at IS NULL');

    // Status distribution
    const statusDistribution = await queryBuilder
      .select('area.is_active', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('area.is_active')
      .getRawMany();

    // Table count distribution
    const tableCountDistribution = await this.areaRepository
      .createQueryBuilder('area')
      .leftJoin('table', 'table', 'table.area_id = area.id AND table.deleted_at IS NULL')
      .select('area.id', 'area_id')
      .addSelect('COUNT(table.id)', 'table_count')
      .where(shopId ? 'area.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('area.deleted_at IS NULL')
      .groupBy('area.id')
      .getRawMany();

    // Categorize table counts
    const ranges = {
      '0': 0,
      '1-5': 0,
      '6-10': 0,
      '> 10': 0,
    };

    tableCountDistribution.forEach((item) => {
      const count = parseInt(item.table_count, 10);
      if (count === 0) ranges['0']++;
      else if (count <= 5) ranges['1-5']++;
      else if (count <= 10) ranges['6-10']++;
      else ranges['> 10']++;
    });

    const tableCountDistributionFormatted = Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }));

    // Total counts
    const totalAreas = await queryBuilder.getCount();

    const activeAreas = await this.areaRepository
      .createQueryBuilder('area')
      .where(shopId ? 'area.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('area.is_active = :isActive', { isActive: true })
      .andWhere('area.deleted_at IS NULL')
      .getCount();

    const totalTables = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('area', 'area', 'area.id = table.area_id')
      .where(shopId ? 'area.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('table.deleted_at IS NULL')
      .getCount();

    return {
      statusDistribution: statusDistribution.map((item) => ({
        status: item.status ? 'Active' : 'Inactive',
        count: parseInt(item.count, 10),
      })),
      tableCountDistribution: tableCountDistributionFormatted,
      totalAreas,
      activeAreas,
      totalTables,
    };
  }

  async getTableStatistics(shopId?: string): Promise<any> {
    const queryBuilder = this.tableRepository.createQueryBuilder('table');

    if (shopId) {
      queryBuilder
        .leftJoin('area', 'area', 'area.id = table.area_id')
        .where('area.shop_id = :shopId', { shopId });
    }
    queryBuilder.andWhere('table.deleted_at IS NULL');

    // Status distribution
    const statusDistribution = await queryBuilder
      .select('table.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('table.status')
      .getRawMany();

    // Area distribution
    const areaDistribution = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('area', 'area', 'area.id = table.area_id')
      .select('area.name', 'area')
      .addSelect('COUNT(table.id)', 'count')
      .where(shopId ? 'area.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('table.deleted_at IS NULL')
      .groupBy('area.id')
      .addGroupBy('area.name')
      .getRawMany();

    // Total counts by status
    const totalTables = await queryBuilder.getCount();

    const availableTables = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('area', 'area', 'area.id = table.area_id')
      .where(shopId ? 'area.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('table.status = :status', { status: 'available' })
      .andWhere('table.deleted_at IS NULL')
      .getCount();

    const occupiedTables = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('area', 'area', 'area.id = table.area_id')
      .where(shopId ? 'area.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('table.status = :status', { status: 'occupied' })
      .andWhere('table.deleted_at IS NULL')
      .getCount();

    const reservedTables = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('area', 'area', 'area.id = table.area_id')
      .where(shopId ? 'area.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('table.status = :status', { status: 'reserved' })
      .andWhere('table.deleted_at IS NULL')
      .getCount();

    const maintenanceTables = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoin('area', 'area', 'area.id = table.area_id')
      .where(shopId ? 'area.shop_id = :shopId' : '1=1', shopId ? { shopId } : {})
      .andWhere('table.status = :status', { status: 'maintenance' })
      .andWhere('table.deleted_at IS NULL')
      .getCount();

    return {
      statusDistribution: statusDistribution.map((item) => ({
        status: item.status,
        count: parseInt(item.count, 10),
      })),
      areaDistribution: areaDistribution.map((item) => ({
        area: item.area || 'Unknown',
        count: parseInt(item.count, 10),
      })),
      totalTables,
      availableTables,
      occupiedTables,
      reservedTables,
      maintenanceTables,
    };
  }

  // Table Reservations
  async findAllReservations(pagination: PaginationDto & { status?: string; table_id?: string; shop_id?: string }): Promise<PaginatedResponseDto<TableReservationEntity>> {
    const { page = 1, limit = 10, search, sort, order = 'desc', status, table_id, shop_id } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.table', 'table')
      .leftJoinAndSelect('reservation.creator', 'creator');

    if (shop_id) {
      queryBuilder.where('reservation.shop_id = :shop_id', { shop_id });
    }

    if (status) {
      queryBuilder.andWhere('reservation.status = :status', { status });
    }

    if (table_id) {
      queryBuilder.andWhere('reservation.table_id = :table_id', { table_id });
    }

    if (search) {
      queryBuilder.andWhere(
        '(reservation.customer_name ILIKE :search OR reservation.customer_phone ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      queryBuilder.orderBy(`reservation.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('reservation.reservation_time', 'DESC');
    }

    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findReservationById(id: string): Promise<TableReservationEntity> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['table', 'creator'],
    });
    if (!reservation) {
      throw new NotFoundException(`Table reservation with ID ${id} not found`);
    }
    return reservation;
  }

  async createReservation(createDto: any): Promise<TableReservationEntity> {
    const reservation = this.reservationRepository.create({
      ...createDto,
      reservation_time: new Date(createDto.reservation_time),
      status: 'pending',
    });
    const savedReservation = await this.reservationRepository.save(reservation);
    return Array.isArray(savedReservation) ? savedReservation[0] : savedReservation;
  }

  async updateReservation(id: string, updateDto: any): Promise<TableReservationEntity> {
    const reservation = await this.findReservationById(id);
    if (updateDto.reservation_time) {
      updateDto.reservation_time = new Date(updateDto.reservation_time);
    }
    Object.assign(reservation, updateDto);
    return await this.reservationRepository.save(reservation);
  }

  async cancelReservation(id: string, reason?: string): Promise<TableReservationEntity> {
    const reservation = await this.findReservationById(id);
    reservation.status = 'cancelled';
    reservation.cancelled_at = new Date();
    reservation.cancelled_reason = reason;
    return await this.reservationRepository.save(reservation);
  }
}

