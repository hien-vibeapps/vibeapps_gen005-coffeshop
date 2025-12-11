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
import { InventoryService } from './inventory.service';
import { CreateIngredientDto } from '../../../application/dto/inventory/create-ingredient.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ApiResponseDto, PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@ApiTags('Inventory')
@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Ingredients
  @Get('ingredients')
  @ApiOperation({ summary: 'Get all ingredients' })
  async getIngredients(@Query() pagination: PaginationDto & { is_active?: boolean; shop_id?: string }): Promise<ApiResponseDto<PaginatedResponseDto<any>>> {
    const result = await this.inventoryService.findAllIngredients(pagination);
    return new ApiResponseDto(result);
  }

  @Get('ingredients/:id')
  @ApiOperation({ summary: 'Get ingredient by ID' })
  async getIngredient(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const ingredient = await this.inventoryService.findIngredientById(id);
    return new ApiResponseDto(ingredient);
  }

  @Post('ingredients')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create ingredient' })
  async createIngredient(@Body() createDto: CreateIngredientDto): Promise<ApiResponseDto<any>> {
    const ingredient = await this.inventoryService.createIngredient(createDto);
    return new ApiResponseDto(ingredient);
  }

  @Put('ingredients/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update ingredient' })
  async updateIngredient(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateIngredientDto>,
  ): Promise<ApiResponseDto<any>> {
    const ingredient = await this.inventoryService.updateIngredient(id, updateDto);
    return new ApiResponseDto(ingredient);
  }

  @Delete('ingredients/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ingredient' })
  async deleteIngredient(@Param('id') id: string): Promise<void> {
    await this.inventoryService.deleteIngredient(id);
  }

  @Get('ingredients/statistics')
  @ApiOperation({ summary: 'Get ingredient statistics' })
  async getIngredientStatistics(@Query('shop_id') shopId?: string): Promise<ApiResponseDto<any>> {
    const statistics = await this.inventoryService.getIngredientStatistics(shopId);
    return new ApiResponseDto(statistics);
  }

  // Inventory Transactions
  @Get('inventory-transactions')
  @ApiOperation({ summary: 'Get all inventory transactions' })
  async getTransactions(@Query() pagination: PaginationDto & { ingredient_id?: string; transaction_type?: string }): Promise<ApiResponseDto<PaginatedResponseDto<any>>> {
    const result = await this.inventoryService.findAllTransactions(pagination);
    return new ApiResponseDto(result);
  }

  @Get('inventory-transactions/:id')
  @ApiOperation({ summary: 'Get inventory transaction by ID' })
  async getTransaction(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const transaction = await this.inventoryService.findTransactionById(id);
    return new ApiResponseDto(transaction);
  }

  @Post('inventory-transactions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create inventory transaction' })
  async createTransaction(@Body() createDto: any): Promise<ApiResponseDto<any>> {
    const transaction = await this.inventoryService.createTransaction(createDto);
    return new ApiResponseDto(transaction);
  }

  @Get('inventory-transactions/statistics')
  @ApiOperation({ summary: 'Get inventory transaction statistics' })
  async getTransactionStatistics(@Query('shop_id') shopId?: string): Promise<ApiResponseDto<any>> {
    const statistics = await this.inventoryService.getTransactionStatistics(shopId);
    return new ApiResponseDto(statistics);
  }
}

