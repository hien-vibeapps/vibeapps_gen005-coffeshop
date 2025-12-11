import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../../../application/dto/order/create-order.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ApiResponseDto, PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async getOrders(@Query() pagination: PaginationDto & {
    status?: string;
    order_type?: string;
    table_id?: string;
    created_by?: string;
    shop_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponseDto<PaginatedResponseDto<any>>> {
    const result = await this.orderService.findAll(pagination);
    return new ApiResponseDto(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async getOrder(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const order = await this.orderService.findById(id);
    return new ApiResponseDto(order);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create order' })
  async createOrder(@Body() createDto: CreateOrderDto): Promise<ApiResponseDto<any>> {
    const order = await this.orderService.create(createDto);
    return new ApiResponseDto(order);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update order' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateOrderDto>,
  ): Promise<ApiResponseDto<any>> {
    const order = await this.orderService.update(id, updateDto);
    return new ApiResponseDto(order);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel order' })
  async cancelOrder(
    @Param('id') id: string,
    @Body() body: { reason: string },
  ): Promise<ApiResponseDto<any>> {
    const order = await this.orderService.cancel(id, body.reason);
    return new ApiResponseDto(order);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<ApiResponseDto<any>> {
    const order = await this.orderService.updateStatus(id, body.status as any);
    return new ApiResponseDto(order);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get order statistics' })
  async getOrderStatistics(@Query('shop_id') shopId?: string): Promise<ApiResponseDto<any>> {
    const statistics = await this.orderService.getStatistics(shopId);
    return new ApiResponseDto(statistics);
  }
}

