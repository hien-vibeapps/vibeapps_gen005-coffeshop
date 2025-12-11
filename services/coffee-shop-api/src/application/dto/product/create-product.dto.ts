import { IsString, IsUUID, IsOptional, IsNumber, IsInt, IsBoolean, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsUUID()
  shop_id: string;

  @ApiProperty()
  @IsUUID()
  category_id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  estimated_prep_time?: number;

  @ApiPropertyOptional({ enum: ['available', 'out_of_stock', 'suspended'] })
  @IsOptional()
  @IsEnum(['available', 'out_of_stock', 'suspended'])
  status?: 'available' | 'out_of_stock' | 'suspended';

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  calories?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  allergen_info?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  display_order?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

