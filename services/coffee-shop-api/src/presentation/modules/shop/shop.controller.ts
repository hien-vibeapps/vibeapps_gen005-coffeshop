import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ShopService } from './shop.service';
import { UpdateShopDto } from '../../../application/dto/shop/update-shop.dto';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

@ApiTags('Shops')
@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get shop by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Shop found' })
  @ApiResponse({ status: 404, description: 'Shop not found' })
  async getShop(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const shop = await this.shopService.findById(id);
    return new ApiResponseDto(shop);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update shop' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Shop updated successfully' })
  @ApiResponse({ status: 404, description: 'Shop not found' })
  async updateShop(
    @Param('id') id: string,
    @Body() updateDto: UpdateShopDto,
  ): Promise<ApiResponseDto<any>> {
    const shop = await this.shopService.update(id, updateDto);
    return new ApiResponseDto(shop);
  }
}

