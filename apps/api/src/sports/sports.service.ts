import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SportsService {
  constructor(private prisma: PrismaService) {}

  async getSports() {
    return this.prisma.sport.findMany({
      where: { isActive: true },
      include: { tournaments: { where: { isActive: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getLiveMatches(sportSlug?: string) {
    return this.prisma.match.findMany({
      where: {
        status: { in: [MatchStatus.LIVE, MatchStatus.INNINGS_BREAK] },
        ...(sportSlug
          ? { tournament: { sport: { slug: sportSlug } } }
          : {}),
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: { include: { sport: true } },
        markets: { include: { selections: true } },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async getUpcomingMatches(sportSlug?: string) {
    return this.prisma.match.findMany({
      where: {
        status: MatchStatus.SCHEDULED,
        startTime: { gte: new Date() },
        ...(sportSlug ? { tournament: { sport: { slug: sportSlug } } } : {}),
      },
      include: { homeTeam: true, awayTeam: true, tournament: true },
      orderBy: { startTime: 'asc' },
      take: 20,
    });
  }

  async getMatch(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: { include: { sport: true } },
        markets: { include: { selections: { where: { isActive: true } } } },
      },
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async getMatchCommentary(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      select: { commentary: true, liveScore: true, winProbability: true },
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }
}
