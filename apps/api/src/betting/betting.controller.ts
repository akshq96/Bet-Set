import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BettingService } from './betting.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlaceBetDto, CashoutDto, ParlayDto } from './dto/betting.dto';

@ApiTags('betting')
@Controller('betting')
export class BettingController {
  constructor(private betting: BettingService) {}

  @Get('markets/:matchId')
  getMarkets(@Param('matchId') matchId: string) {
    return this.betting.getMarkets(matchId);
  }

  @Post('place')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  placeBet(@Req() req: { user: { sub: string } }, @Body() dto: PlaceBetDto) {
    return this.betting.placeBet(req.user.sub, dto);
  }

  @Post('parlay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  placeParlay(@Req() req: { user: { sub: string } }, @Body() dto: ParlayDto) {
    return this.betting.placeParlay(req.user.sub, dto.selections, dto.totalStake);
  }

  @Post('cashout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  cashout(@Req() req: { user: { sub: string } }, @Body() dto: CashoutDto) {
    return this.betting.cashout(req.user.sub, dto);
  }
}
