import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PlayerPick {
  @IsString()
  playerId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  credits?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCaptain?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isViceCaptain?: boolean;
}

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [PlayerPick] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerPick)
  picks: PlayerPick[];
}

export class JoinContestDto {
  @ApiProperty()
  @IsString()
  contestId: string;

  @ApiProperty()
  @IsString()
  fantasyTeamId: string;
}
