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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from '../../../application/dto/employee/create-employee.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ApiResponseDto, PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  async getEmployees(@Query() pagination: PaginationDto & { role?: string; is_active?: boolean; shop_id?: string }): Promise<ApiResponseDto<PaginatedResponseDto<any>>> {
    const result = await this.employeeService.findAll(pagination);
    return new ApiResponseDto(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  async getEmployee(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const employee = await this.employeeService.findById(id);
    return new ApiResponseDto(employee);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create employee' })
  async createEmployee(@Body() createDto: CreateEmployeeDto): Promise<ApiResponseDto<any>> {
    const employee = await this.employeeService.create(createDto);
    return new ApiResponseDto(employee);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update employee' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateEmployeeDto>,
  ): Promise<ApiResponseDto<any>> {
    const employee = await this.employeeService.update(id, updateDto);
    return new ApiResponseDto(employee);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete employee' })
  async deleteEmployee(@Param('id') id: string): Promise<void> {
    await this.employeeService.delete(id);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get employee statistics' })
  async getEmployeeStatistics(@Query('shop_id') shopId?: string): Promise<ApiResponseDto<any>> {
    const statistics = await this.employeeService.getStatistics(shopId);
    return new ApiResponseDto(statistics);
  }

  // Employee Permissions
  @Get(':id/permissions')
  @ApiOperation({ summary: 'Get employee permissions' })
  async getEmployeePermissions(@Param('id') id: string): Promise<ApiResponseDto<any[]>> {
    const permissions = await this.employeeService.getEmployeePermissions(id);
    return new ApiResponseDto(permissions);
  }

  @Put(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update employee permissions' })
  async updateEmployeePermissions(
    @Param('id') id: string,
    @Body() body: { permissions: { permission_code: string; is_granted: boolean }[] },
  ): Promise<ApiResponseDto<any[]>> {
    const permissions = await this.employeeService.updateEmployeePermissions(id, body.permissions);
    return new ApiResponseDto(permissions);
  }
}

