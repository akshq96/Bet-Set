import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FantasyService } from './fantasy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTeamDto, JoinContestDto } from './dto/fantasy.dto';

@ApiTags('fantasy')
@Controller('fantasy')
export class FantasyController {
  constructor(private fantasy: FantasyService) {}

  @Get('contests')
  getContests(@Query('matchId') matchId?: string) {
    return this.fantasy.getContests(matchId);
  }

  @Get('players/:matchId')
  getPlayers(@Param('matchId') matchId: string) {
    return this.fantasy.getPlayers(matchId);
  }

  @Post('teams')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createTeam(@Req() req: { user: { sub: string } }, @Body() dto: CreateTeamDto) {
    return this.fantasy.createTeam(req.user.sub, dto);
  }

  @Post('join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  joinContest(@Req() req: { user: { sub: string } }, @Body() dto: JoinContestDto) {
    return this.fantasy.joinContest(req.user.sub, dto);
  }

  @Get('leaderboard/:contestId')
  getLeaderboard(@Param('contestId') contestId: string) {
    return this.fantasy.getLeaderboard(contestId);
  }
}
