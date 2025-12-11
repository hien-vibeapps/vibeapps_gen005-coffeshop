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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from '../../../application/dto/product/create-product.dto';
import { UpdateProductDto } from '../../../application/dto/product/update-product.dto';
import { ProductListQueryDto } from '../../../application/dto/product/product-list-query.dto';
import { ApiResponseDto, PaginatedResponseDto } from '../../../common/dto/api-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getProducts(
    @Query() query: ProductListQueryDto,
  ): Promise<ApiResponseDto<PaginatedResponseDto<any>>> {
    const result = await this.productService.findAll(query);
    return new ApiResponseDto(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const product = await this.productService.findById(id);
    return new ApiResponseDto(product);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async createProduct(
    @Body() createDto: CreateProductDto,
  ): Promise<ApiResponseDto<any>> {
    const product = await this.productService.create(createDto);
    return new ApiResponseDto(product);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto,
  ): Promise<ApiResponseDto<any>> {
    const product = await this.productService.update(id, updateDto);
    return new ApiResponseDto(product);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.delete(id);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get product statistics' })
  @ApiResponse({ status: 200, description: 'Product statistics retrieved successfully' })
  async getProductStatistics(@Query('shop_id') shopId?: string): Promise<ApiResponseDto<any>> {
    const statistics = await this.productService.getStatistics(shopId);
    return new ApiResponseDto(statistics);
  }

  // Product Images
  @Post(':id/images')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload product image' })
  @ApiParam({ name: 'id', type: 'string' })
  async uploadProductImage(
    @Param('id') productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { display_order?: number | string; is_primary?: boolean | string },
    ): Promise<ApiResponseDto<any>> {
    // TODO: Implement actual file upload to storage (S3, local, etc.)
    // For now, we'll use a placeholder URL
    const imageUrl = file ? `/uploads/products/${file.filename}` : body['image_url'] || '';
    const image = await this.productService.uploadProductImage(
      productId,
      imageUrl,
      body.display_order ? parseInt(body.display_order.toString(), 10) : undefined,
      body.is_primary === true || body.is_primary === 'true',
    );
    return new ApiResponseDto(image);
  }

  @Delete(':id/images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product image' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'imageId', type: 'string' })
  async deleteProductImage(
    @Param('id') productId: string,
    @Param('imageId') imageId: string,
  ): Promise<void> {
    await this.productService.deleteProductImage(productId, imageId);
  }

  // Product Option Groups
  @Post(':id/option-groups')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product option group' })
  @ApiParam({ name: 'id', type: 'string' })
  async createOptionGroup(
    @Param('id') productId: string,
    @Body() createDto: any,
  ): Promise<ApiResponseDto<any>> {
    const optionGroup = await this.productService.createOptionGroup(productId, createDto);
    return new ApiResponseDto(optionGroup);
  }

  @Put(':id/option-groups/:optionGroupId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update product option group' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'optionGroupId', type: 'string' })
  async updateOptionGroup(
    @Param('id') productId: string,
    @Param('optionGroupId') optionGroupId: string,
    @Body() updateDto: any,
  ): Promise<ApiResponseDto<any>> {
    const optionGroup = await this.productService.updateOptionGroup(productId, optionGroupId, updateDto);
    return new ApiResponseDto(optionGroup);
  }

  @Delete(':id/option-groups/:optionGroupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product option group' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'optionGroupId', type: 'string' })
  async deleteOptionGroup(
    @Param('id') productId: string,
    @Param('optionGroupId') optionGroupId: string,
  ): Promise<void> {
    await this.productService.deleteOptionGroup(productId, optionGroupId);
  }

  // Product Options
  @Post(':id/option-groups/:optionGroupId/options')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product option' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'optionGroupId', type: 'string' })
  async createOption(
    @Param('id') productId: string,
    @Param('optionGroupId') optionGroupId: string,
    @Body() createDto: any,
  ): Promise<ApiResponseDto<any>> {
    const option = await this.productService.createOption(productId, optionGroupId, createDto);
    return new ApiResponseDto(option);
  }

  @Put(':id/option-groups/:optionGroupId/options/:optionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update product option' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'optionGroupId', type: 'string' })
  @ApiParam({ name: 'optionId', type: 'string' })
  async updateOption(
    @Param('id') productId: string,
    @Param('optionGroupId') optionGroupId: string,
    @Param('optionId') optionId: string,
    @Body() updateDto: any,
  ): Promise<ApiResponseDto<any>> {
    const option = await this.productService.updateOption(productId, optionGroupId, optionId, updateDto);
    return new ApiResponseDto(option);
  }

  @Delete(':id/option-groups/:optionGroupId/options/:optionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product option' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'optionGroupId', type: 'string' })
  @ApiParam({ name: 'optionId', type: 'string' })
  async deleteOption(
    @Param('id') productId: string,
    @Param('optionGroupId') optionGroupId: string,
    @Param('optionId') optionId: string,
  ): Promise<void> {
    await this.productService.deleteOption(productId, optionGroupId, optionId);
  }
}

