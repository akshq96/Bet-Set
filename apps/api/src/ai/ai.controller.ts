import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private ai: AiService) {}

  @Get('predict/:matchId')
  getPrediction(@Param('matchId') matchId: string) {
    return this.ai.getMatchPrediction(matchId);
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  recommendations(@Req() req: { user: { sub: string } }) {
    return this.ai.getPersonalizedRecommendations(req.user.sub);
  }
}
