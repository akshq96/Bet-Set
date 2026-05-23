import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { TradeDto } from './dto/predictions.dto';
import { WS_EVENTS } from '@sportstrike/shared';

@Injectable()
export class PredictionsService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private ws: WebsocketGateway,
  ) {}

  async getMarkets(category?: string) {
    return this.prisma.predictionMarket.findMany({
      where: {
        status: 'ACTIVE',
        ...(category ? { category } : {}),
      },
      orderBy: { volume: 'desc' },
    });
  }

  async getMarket(id: string) {
    const market = await this.prisma.predictionMarket.findUnique({
      where: { id },
      include: {
        priceHistory: { orderBy: { timestamp: 'desc' }, take: 100 },
        orders: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!market) throw new NotFoundException('Market not found');
    return market;
  }

  /** Probo-style AMM pricing — simplified constant product market maker */
  private calculateNewPrices(
    yesPrice: number,
    noPrice: number,
    side: 'YES' | 'NO',
    shares: number,
    liquidity: number,
  ) {
    const k = yesPrice * noPrice * liquidity;
    let newYes = yesPrice;
    let newNo = noPrice;

    if (side === 'YES') {
      newYes = Math.min(0.99, yesPrice + shares / liquidity);
      newNo = Math.max(0.01, k / (newYes * liquidity));
    } else {
      newNo = Math.min(0.99, noPrice + shares / liquidity);
      newYes = Math.max(0.01, k / (newNo * liquidity));
    }

    return { yesPrice: newYes, noPrice: newNo };
  }

  async trade(userId: string, dto: TradeDto) {
    const market = await this.prisma.predictionMarket.findUnique({ where: { id: dto.marketId } });
    if (!market || market.status !== 'ACTIVE') {
      throw new BadRequestException('Market not active');
    }

    const price = dto.side === 'YES' ? Number(market.yesPrice) : Number(market.noPrice);
    const totalCost = dto.shares * price;

    if (dto.action === 'BUY') {
      await this.wallet.deductForBet(userId, totalCost, dto.marketId);
    }

    const { yesPrice, noPrice } = this.calculateNewPrices(
      Number(market.yesPrice),
      Number(market.noPrice),
      dto.side,
      dto.shares,
      Number(market.liquidity),
    );

    const order = await this.prisma.predictionOrder.create({
      data: {
        marketId: dto.marketId,
        userId,
        side: dto.side,
        shares: dto.shares,
        price,
        totalCost,
      },
    });

    await this.prisma.predictionMarket.update({
      where: { id: dto.marketId },
      data: {
        yesPrice,
        noPrice,
        volume: { increment: totalCost },
      },
    });

    await this.prisma.predictionPortfolio.upsert({
      where: { marketId_userId: { marketId: dto.marketId, userId } },
      update: {
        yesShares: dto.side === 'YES' ? { increment: dto.shares } : undefined,
        noShares: dto.side === 'NO' ? { increment: dto.shares } : undefined,
      },
      create: {
        marketId: dto.marketId,
        userId,
        yesShares: dto.side === 'YES' ? dto.shares : 0,
        noShares: dto.side === 'NO' ? dto.shares : 0,
      },
    });

    await this.prisma.predictionPriceHistory.create({
      data: { marketId: dto.marketId, yesPrice, noPrice },
    });

    this.ws.emitPredictionPrice(dto.marketId, { yesPrice, noPrice, volume: Number(market.volume) + totalCost });

    return order;
  }

  async getPortfolio(userId: string) {
    return this.prisma.predictionPortfolio.findMany({
      where: { userId },
      include: { market: true },
    });
  }

  async settleMarket(marketId: string, outcome: 'YES' | 'NO') {
    const market = await this.prisma.predictionMarket.findUnique({ where: { id: marketId } });
    if (!market) throw new NotFoundException('Market not found');

    const portfolios = await this.prisma.predictionPortfolio.findMany({ where: { marketId } });

    for (const portfolio of portfolios) {
      const winningShares = outcome === 'YES' ? Number(portfolio.yesShares) : Number(portfolio.noShares);
      if (winningShares > 0) {
        await this.wallet.creditWinnings(portfolio.userId, winningShares, marketId);
      }
    }

    await this.prisma.predictionMarket.update({
      where: { id: marketId },
      data: { status: 'RESOLVED', resolvedOutcome: outcome },
    });

    return { message: 'Market resolved', outcome };
  }
}
