import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from '../../../application/dto/payment/create-payment.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ApiResponseDto, PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  async getPayments(@Query() pagination: PaginationDto & { order_id?: string; payment_method?: string; shop_id?: string }): Promise<ApiResponseDto<PaginatedResponseDto<any>>> {
    const result = await this.paymentService.findAll(pagination);
    return new ApiResponseDto(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  async getPayment(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const payment = await this.paymentService.findById(id);
    return new ApiResponseDto(payment);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create payment' })
  async createPayment(@Body() createDto: CreatePaymentDto): Promise<ApiResponseDto<any>> {
    const payment = await this.paymentService.create(createDto);
    return new ApiResponseDto(payment);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get payment statistics' })
  async getPaymentStatistics(@Query('shop_id') shopId?: string): Promise<ApiResponseDto<any>> {
    const statistics = await this.paymentService.getStatistics(shopId);
    return new ApiResponseDto(statistics);
  }
}

