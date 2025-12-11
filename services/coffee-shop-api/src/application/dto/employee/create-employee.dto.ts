import { IsString, IsUUID, IsEmail, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsUUID()
  shop_id: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty({ enum: ['owner', 'manager', 'shift_manager', 'waiter', 'cashier', 'barista'] })
  @IsEnum(['owner', 'manager', 'shift_manager', 'waiter', 'cashier', 'barista'])
  role: 'owner' | 'manager' | 'shift_manager' | 'waiter' | 'cashier' | 'barista';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

