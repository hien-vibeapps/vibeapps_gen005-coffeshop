import { IsString, IsUUID, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  order_id: string;

  @ApiProperty({ enum: ['cash', 'card', 'bank_transfer', 'e_wallet'] })
  @IsEnum(['cash', 'card', 'bank_transfer', 'e_wallet'])
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'e_wallet';

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  received_amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transaction_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

