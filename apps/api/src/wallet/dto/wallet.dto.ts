import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty()
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class WithdrawDto {
  @ApiProperty()
  @IsNumber()
  @Min(500)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  upiId?: string;
}
