import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { FANTASY_POINTS } from '@sportstrike/shared';
import { CreateTeamDto, JoinContestDto } from './dto/fantasy.dto';

@Injectable()
export class FantasyService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
  ) {}

  async getContests(matchId?: string) {
    return this.prisma.fantasyContest.findMany({
      where: matchId ? { matchId } : undefined,
      include: {
        match: { include: { homeTeam: true, awayTeam: true } },
        _count: { select: { entries: true } },
      },
      orderBy: { startsAt: 'asc' },
    });
  }

  async getPlayers(matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { homeTeam: true, awayTeam: true },
    });
    if (!match) throw new NotFoundException('Match not found');

    return this.prisma.player.findMany({
      where: {
        OR: [{ teamId: match.homeTeamId }, { teamId: match.awayTeamId }],
      },
      include: { team: true },
    });
  }

  async createTeam(userId: string, dto: CreateTeamDto) {
    if (dto.picks.length !== 11) {
      throw new BadRequestException('Team must have exactly 11 players');
    }

    const captains = dto.picks.filter((p) => p.isCaptain).length;
    const viceCaptains = dto.picks.filter((p) => p.isViceCaptain).length;
    if (captains !== 1 || viceCaptains !== 1) {
      throw new BadRequestException('Select exactly 1 captain and 1 vice-captain');
    }

    const totalCredits = dto.picks.reduce((sum, p) => sum + (p.credits || 0), 0);
    if (totalCredits > 100) {
      throw new BadRequestException('Total credits cannot exceed 100');
    }

    return this.prisma.fantasyTeam.create({
      data: {
        userId,
        name: dto.name,
        picks: {
          create: dto.picks.map((p) => ({
            playerId: p.playerId,
            isCaptain: p.isCaptain || false,
            isViceCaptain: p.isViceCaptain || false,
          })),
        },
      },
      include: { picks: { include: { player: true } } },
    });
  }

  async joinContest(userId: string, dto: JoinContestDto) {
    const contest = await this.prisma.fantasyContest.findUnique({
      where: { id: dto.contestId },
    });
    if (!contest) throw new NotFoundException('Contest not found');
    if (contest.currentEntries >= contest.maxEntries) {
      throw new BadRequestException('Contest is full');
    }

    const existing = await this.prisma.fantasyEntry.findUnique({
      where: { contestId_userId: { contestId: dto.contestId, userId } },
    });
    if (existing) throw new BadRequestException('Already joined this contest');

    await this.wallet.deductForBet(userId, Number(contest.entryFee), dto.contestId);

    const entry = await this.prisma.fantasyEntry.create({
      data: {
        contestId: dto.contestId,
        userId,
        fantasyTeamId: dto.fantasyTeamId,
      },
    });

    await this.prisma.fantasyContest.update({
      where: { id: dto.contestId },
      data: { currentEntries: { increment: 1 } },
    });

    return entry;
  }

  /** Dream11-style points calculation */
  calculatePlayerPoints(
    stats: { runs?: number; wickets?: number; catches?: number; fours?: number; sixes?: number },
    isCaptain: boolean,
    isViceCaptain: boolean,
    role: string,
  ): number {
    let points = 0;
    const rules = FANTASY_POINTS;

    if (role === 'BAT' || role === 'WK') {
      points += (stats.runs || 0) * rules.BAT.run;
      points += (stats.fours || 0) * rules.BAT.boundary;
      points += (stats.sixes || 0) * rules.BAT.six;
      if ((stats.runs || 0) >= 100) points += rules.BAT.hundred;
      else if ((stats.runs || 0) >= 50) points += rules.BAT.fifty;
    }

    if (role === 'BOWL') {
      points += (stats.wickets || 0) * rules.BOWL.wicket;
    }

    points += (stats.catches || 0) * rules.FIELD.catch;

    if (isCaptain) points *= rules.CAPTAIN_MULTIPLIER;
    else if (isViceCaptain) points *= rules.VICE_CAPTAIN_MULTIPLIER;

    return Math.round(points * 100) / 100;
  }

  async updateLeaderboard(contestId: string) {
    const entries = await this.prisma.fantasyEntry.findMany({
      where: { contestId },
      include: {
        fantasyTeam: { include: { picks: { include: { player: true } } } },
      },
    });

    const scored = entries.map((entry) => {
      let total = 0;
      for (const pick of entry.fantasyTeam.picks) {
        const stats = (pick.player.stats as Record<string, number>) || {};
        total += this.calculatePlayerPoints(
          stats,
          pick.isCaptain,
          pick.isViceCaptain,
          pick.player.role || 'BAT',
        );
      }
      return { entryId: entry.id, total };
    });

    scored.sort((a, b) => b.total - a.total);

    for (let i = 0; i < scored.length; i++) {
      await this.prisma.fantasyEntry.update({
        where: { id: scored[i].entryId },
        data: { totalPoints: scored[i].total, rank: i + 1 },
      });
    }

    return scored;
  }

  async getLeaderboard(contestId: string) {
    return this.prisma.fantasyEntry.findMany({
      where: { contestId },
      include: {
        user: { select: { id: true, displayName: true, avatar: true } },
        fantasyTeam: { select: { name: true } },
      },
      orderBy: { totalPoints: 'desc' },
      take: 100,
    });
  }
}
