import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiQuery({ name: 'start_date', required: true, type: String })
  @ApiQuery({ name: 'end_date', required: true, type: String })
  @ApiQuery({ name: 'group_by', required: false, enum: ['day', 'week', 'month'] })
  async getRevenueReport(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
    @Query('group_by') groupBy?: 'day' | 'week' | 'month',
  ): Promise<ApiResponseDto<any>> {
    const report = await this.reportService.getRevenueReport(startDate, endDate, groupBy);
    return new ApiResponseDto(report);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales report' })
  @ApiQuery({ name: 'start_date', required: true, type: String })
  @ApiQuery({ name: 'end_date', required: true, type: String })
  async getSalesReport(
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ): Promise<ApiResponseDto<any>> {
    const report = await this.reportService.getSalesReport(startDate, endDate);
    return new ApiResponseDto(report);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory report' })
  async getInventoryReport(): Promise<ApiResponseDto<any>> {
    const report = await this.reportService.getInventoryReport();
    return new ApiResponseDto(report);
  }
}

