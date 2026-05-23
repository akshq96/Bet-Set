import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { BettingService } from '../betting/betting.service';
import { WS_EVENTS } from '@sportstrike/shared';

/**
 * Simulates live sports data feed — ball-by-ball updates, odds movement
 * Replace with CricAPI / Sportradar in production
 */
@Injectable()
export class MockDataService implements OnModuleInit {
  private intervals: NodeJS.Timeout[] = [];

  constructor(
    private prisma: PrismaService,
    private ws: WebsocketGateway,
    private betting: BettingService,
  ) {}

  onModuleInit() {
    if (process.env.NODE_ENV !== 'test') {
      this.startLiveSimulation();
    }
  }

  startLiveSimulation() {
    // Simulate odds movement every 5 seconds
    const oddsInterval = setInterval(() => this.simulateOddsMovement(), 5000);
    // Simulate live score updates every 8 seconds
    const scoreInterval = setInterval(() => this.simulateScoreUpdate(), 8000);
    // Simulate prediction market prices every 10 seconds
    const predInterval = setInterval(() => this.simulatePredictionPrices(), 10000);

    this.intervals.push(oddsInterval, scoreInterval, predInterval);
    console.log('📡 Mock live data simulation started');
  }

  private async simulateOddsMovement() {
    const liveSelections = await this.prisma.selection.findMany({
      where: { isActive: true, market: { match: { status: 'LIVE' } } },
      take: 10,
    });

    for (const sel of liveSelections) {
      const direction = Math.random() > 0.5 ? 'up' : 'down';
      await this.betting.adjustOdds(sel.id, direction as 'up' | 'down');
    }
  }

  private async simulateScoreUpdate() {
    const liveMatches = await this.prisma.match.findMany({
      where: { status: 'LIVE' },
      take: 5,
    });

    for (const match of liveMatches) {
      const score = match.liveScore as Record<string, unknown> || {};
      const runs = Math.floor(Math.random() * 7);
      const types = ['dot', 'single', 'boundary', 'six', 'wicket'];
      const ballType = types[Math.floor(Math.random() * types.length)];

      const updatedScore = {
        ...score,
        lastBall: { runs, type: ballType },
        commentary: [
          {
            over: score.overs || '0.0',
            text: this.getCommentaryText(ballType, runs),
            timestamp: Date.now(),
          },
          ...((score.commentary as unknown[]) || []).slice(0, 19),
        ],
      };

      await this.prisma.match.update({
        where: { id: match.id },
        data: { liveScore: updatedScore },
      });

      this.ws.emitMatchScore(match.id, updatedScore);
    }
  }

  private async simulatePredictionPrices() {
    const markets = await this.prisma.predictionMarket.findMany({
      where: { status: 'ACTIVE' },
      take: 5,
    });

    for (const market of markets) {
      const delta = (Math.random() - 0.5) * 0.02;
      const yesPrice = Math.max(0.05, Math.min(0.95, Number(market.yesPrice) + delta));
      const noPrice = 1 - yesPrice;

      await this.prisma.predictionMarket.update({
        where: { id: market.id },
        data: { yesPrice, noPrice },
      });

      this.ws.emitPredictionPrice(market.id, { yesPrice, noPrice });
    }
  }

  private getCommentaryText(type: string, runs: number): string {
    const texts: Record<string, string[]> = {
      boundary: ['FOUR! What a shot!', 'Cracked away to the boundary!'],
      six: ['SIX! Into the stands!', 'Maximum! The crowd goes wild!'],
      wicket: ['OUT! Huge wicket!', 'Gone! The bowler strikes!'],
      dot: ['Dot ball. Good bowling.', 'Beaten outside off!'],
      single: ['Quick single taken.', 'They scamper through for one.'],
    };
    const options = texts[type] || texts.single;
    return options[Math.floor(Math.random() * options.length)];
  }

  /** Generate full mock IPL dataset */
  async generateMockData() {
    return {
      message: 'Use prisma/seed.ts for full data generation',
      tip: 'Run: npm run db:seed',
    };
  }
}
