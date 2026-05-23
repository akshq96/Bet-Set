import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  /** Mock AI predictions — integrate OpenAI in production */
  async getMatchPrediction(matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { homeTeam: true, awayTeam: true },
    });
    if (!match) return null;

    const homeProb = 0.35 + Math.random() * 0.3;
    return {
      matchId,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      prediction: {
        homeWinProbability: homeProb,
        awayWinProbability: 1 - homeProb,
        confidence: 0.72 + Math.random() * 0.2,
        factors: [
          'Recent form favors away team',
          'Home advantage at venue',
          'Key player availability',
        ],
        suggestedBets: [
          { market: 'Match Winner', selection: match.awayTeam.shortName, odds: 1.72, confidence: 'high' },
          { market: 'Total Runs Over', selection: 'Over 340.5', odds: 1.9, confidence: 'medium' },
        ],
      },
      disclaimer: 'AI predictions are for entertainment only. Bet responsibly.',
    };
  }

  async getPersonalizedRecommendations(userId: string) {
    const recentBets = await this.prisma.bet.findMany({
      where: { userId },
      take: 10,
      include: { selection: { include: { market: true } } },
    });

    return {
      userId,
      recommendations: [
        { type: 'fantasy', title: 'IPL Mega Contest', reason: 'Based on your cricket activity' },
        { type: 'prediction', title: 'CSK to win IPL 2026', reason: 'Trending in your region' },
        { type: 'bet', title: 'Live: Over 8.5 Runs', reason: 'High win rate market' },
      ],
      basedOn: recentBets.length,
    };
  }

  async detectFraud(userId: string) {
    const recentTx = await this.prisma.transaction.count({
      where: {
        wallet: { userId },
        createdAt: { gte: new Date(Date.now() - 3600000) },
      },
    });

    const alerts = [];
    if (recentTx > 20) {
      alerts.push({ type: 'HIGH_FREQUENCY', severity: 'HIGH', description: 'Unusual transaction frequency' });
    }

    return { userId, alerts, riskScore: alerts.length * 25 };
  }
}
