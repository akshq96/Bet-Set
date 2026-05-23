import { IsArray, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceBetDto {
  @ApiProperty()
  @IsString()
  selectionId: string;

  @ApiProperty()
  @IsNumber()
  @Min(10)
  stake: number;
}

export class CashoutDto {
  @ApiProperty()
  @IsString()
  betId: string;
}

class ParlaySelection {
  @IsString()
  selectionId: string;
}

export class ParlayDto {
  @ApiProperty({ type: [ParlaySelection] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParlaySelection)
  selections: ParlaySelection[];

  @ApiProperty()
  @IsNumber()
  @Min(10)
  totalStake: number;
}
