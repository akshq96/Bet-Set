import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TradeDto {
  @ApiProperty()
  @IsString()
  marketId: string;

  @ApiProperty({ enum: ['YES', 'NO'] })
  @IsEnum(['YES', 'NO'])
  side: 'YES' | 'NO';

  @ApiProperty({ enum: ['BUY', 'SELL'] })
  @IsEnum(['BUY', 'SELL'])
  action: 'BUY' | 'SELL';

  @ApiProperty()
  @IsNumber()
  @Min(1)
  shares: number;
}
