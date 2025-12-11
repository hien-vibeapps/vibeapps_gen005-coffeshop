import { IsString, IsUUID, IsOptional, IsInt, IsNumber, IsBoolean, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty()
  @IsUUID()
  area_id: string;

  @ApiProperty()
  @IsString()
  table_number: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  capacity?: number;

  @ApiPropertyOptional({ enum: ['available', 'occupied', 'reserved', 'maintenance'] })
  @IsOptional()
  @IsEnum(['available', 'occupied', 'reserved', 'maintenance'])
  status?: 'available' | 'occupied' | 'reserved' | 'maintenance';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  position_x?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  position_y?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

