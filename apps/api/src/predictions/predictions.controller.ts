import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PredictionsService } from './predictions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TradeDto } from './dto/predictions.dto';

@ApiTags('predictions')
@Controller('predictions')
export class PredictionsController {
  constructor(private predictions: PredictionsService) {}

  @Get('markets')
  getMarkets(@Query('category') category?: string) {
    return this.predictions.getMarkets(category);
  }

  @Get('markets/:id')
  getMarket(@Param('id') id: string) {
    return this.predictions.getMarket(id);
  }

  @Post('trade')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  trade(@Req() req: { user: { sub: string } }, @Body() dto: TradeDto) {
    return this.predictions.trade(req.user.sub, dto);
  }

  @Get('portfolio')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  portfolio(@Req() req: { user: { sub: string } }) {
    return this.predictions.getPortfolio(req.user.sub);
  }
}
