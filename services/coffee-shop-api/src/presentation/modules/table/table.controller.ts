import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TableService } from './table.service';
import { CreateAreaDto } from '../../../application/dto/table/create-area.dto';
import { CreateTableDto } from '../../../application/dto/table/create-table.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ApiResponseDto, PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@ApiTags('Tables')
@Controller()
export class TableController {
  constructor(private readonly tableService: TableService) {}

  // Areas
  @Get('areas')
  @ApiOperation({ summary: 'Get all areas' })
  async getAreas(@Query() pagination: PaginationDto & { shop_id?: string }): Promise<ApiResponseDto<PaginatedResponseDto<any>>> {
    const result = await this.tableService.findAllAreas(pagination);
    return new ApiResponseDto(result);
  }

  @Get('areas/:id')
  @ApiOperation({ summary: 'Get area by ID' })
  async getArea(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const area = await this.tableService.findAreaById(id);
    return new ApiResponseDto(area);
  }

  @Post('areas')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create area' })
  async createArea(@Body() createDto: CreateAreaDto): Promise<ApiResponseDto<any>> {
    const area = await this.tableService.createArea(createDto);
    return new ApiResponseDto(area);
  }

  @Put('areas/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update area' })
  async updateArea(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateAreaDto>,
  ): Promise<ApiResponseDto<any>> {
    const area = await this.tableService.updateArea(id, updateDto);
    return new ApiResponseDto(area);
  }

  @Delete('areas/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete area' })
  async deleteArea(@Param('id') id: string): Promise<void> {
    await this.tableService.deleteArea(id);
  }

  // Tables
  @Get('tables')
  @ApiOperation({ summary: 'Get all tables' })
  async getTables(@Query() pagination: PaginationDto & { area_id?: string; status?: string }): Promise<ApiResponseDto<PaginatedResponseDto<any>>> {
    const result = await this.tableService.findAllTables(pagination);
    return new ApiResponseDto(result);
  }

  @Get('tables/:id')
  @ApiOperation({ summary: 'Get table by ID' })
  async getTable(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const table = await this.tableService.findTableById(id);
    return new ApiResponseDto(table);
  }

  @Post('tables')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create table' })
  async createTable(@Body() createDto: CreateTableDto): Promise<ApiResponseDto<any>> {
    const table = await this.tableService.createTable(createDto);
    return new ApiResponseDto(table);
  }

  @Put('tables/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update table' })
  async updateTable(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateTableDto>,
  ): Promise<ApiResponseDto<any>> {
    const table = await this.tableService.updateTable(id, updateDto);
    return new ApiResponseDto(table);
  }

  @Delete('tables/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete table' })
  async deleteTable(@Param('id') id: string): Promise<void> {
    await this.tableService.deleteTable(id);
  }

  @Get('areas/statistics')
  @ApiOperation({ summary: 'Get area statistics' })
  async getAreaStatistics(@Query('shop_id') shopId?: string): Promise<ApiResponseDto<any>> {
    const statistics = await this.tableService.getAreaStatistics(shopId);
    return new ApiResponseDto(statistics);
  }

  @Get('tables/statistics')
  @ApiOperation({ summary: 'Get table statistics' })
  async getTableStatistics(@Query('shop_id') shopId?: string): Promise<ApiResponseDto<any>> {
    const statistics = await this.tableService.getTableStatistics(shopId);
    return new ApiResponseDto(statistics);
  }

  // Table Reservations
  @Get('table-reservations')
  @ApiOperation({ summary: 'Get all table reservations' })
  async getReservations(@Query() pagination: PaginationDto & { status?: string; table_id?: string; shop_id?: string }): Promise<ApiResponseDto<PaginatedResponseDto<any>>> {
    const result = await this.tableService.findAllReservations(pagination);
    return new ApiResponseDto(result);
  }

  @Get('table-reservations/:id')
  @ApiOperation({ summary: 'Get table reservation by ID' })
  async getReservation(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const reservation = await this.tableService.findReservationById(id);
    return new ApiResponseDto(reservation);
  }

  @Post('table-reservations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create table reservation' })
  async createReservation(@Body() createDto: any): Promise<ApiResponseDto<any>> {
    const reservation = await this.tableService.createReservation(createDto);
    return new ApiResponseDto(reservation);
  }

  @Put('table-reservations/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update table reservation' })
  async updateReservation(
    @Param('id') id: string,
    @Body() updateDto: any,
  ): Promise<ApiResponseDto<any>> {
    const reservation = await this.tableService.updateReservation(id, updateDto);
    return new ApiResponseDto(reservation);
  }

  @Post('table-reservations/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel table reservation' })
  async cancelReservation(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ): Promise<ApiResponseDto<any>> {
    const reservation = await this.tableService.cancelReservation(id, body.reason);
    return new ApiResponseDto(reservation);
  }
}

