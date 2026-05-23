import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SportsService } from './sports.service';

@ApiTags('sports')
@Controller('sports')
export class SportsController {
  constructor(private sports: SportsService) {}

  @Get()
  getSports() {
    return this.sports.getSports();
  }

  @Get('live')
  getLive(@Query('sport') sport?: string) {
    return this.sports.getLiveMatches(sport);
  }

  @Get('upcoming')
  getUpcoming(@Query('sport') sport?: string) {
    return this.sports.getUpcomingMatches(sport);
  }

  @Get('matches/:id')
  getMatch(@Param('id') id: string) {
    return this.sports.getMatch(id);
  }

  @Get('matches/:id/commentary')
  getCommentary(@Param('id') id: string) {
    return this.sports.getMatchCommentary(id);
  }
}
