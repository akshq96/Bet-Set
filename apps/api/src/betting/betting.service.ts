import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { BetStatus, MarketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { PlaceBetDto, CashoutDto } from './dto/betting.dto';
import { WS_EVENTS } from '@sportstrike/shared';

@Injectable()
export class BettingService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private ws: WebsocketGateway,
  ) {}

  async getMarkets(matchId: string) {
    return this.prisma.market.findMany({
      where: { matchId },
      include: { selections: { where: { isActive: true }, orderBy: { odds: 'asc' } } },
    });
  }

  async placeBet(userId: string, dto: PlaceBetDto) {
    const selection = await this.prisma.selection.findUnique({
      where: { id: dto.selectionId },
      include: { market: true },
    });
    if (!selection || !selection.isActive) {
      throw new BadRequestException('Selection not available');
    }
    if (selection.market.status !== MarketStatus.OPEN) {
      throw new BadRequestException('Market is suspended');
    }

    const potentialWin = dto.stake * Number(selection.odds);
    await this.wallet.deductForBet(userId, dto.stake, 'pending');

    const bet = await this.prisma.bet.create({
      data: {
        userId,
        selectionId: dto.selectionId,
        stake: dto.stake,
        odds: selection.odds,
        potentialWin,
        status: BetStatus.ACCEPTED,
      },
      include: { selection: { include: { market: true } } },
    });

    this.ws.emitToUser(userId, WS_EVENTS.WALLET_UPDATE, { type: 'bet_placed', stake: dto.stake });
    return bet;
  }

  /** Place parlay (multi-bet) */
  async placeParlay(userId: string, selections: { selectionId: string; stake?: number }[], totalStake: number) {
    const slip = await this.prisma.betSlip.create({
      data: { userId, totalStake, isParlay: true, potentialReturn: 0, status: BetStatus.PENDING },
    });

    let combinedOdds = 1;
    const bets = [];

    for (const item of selections) {
      const selection = await this.prisma.selection.findUnique({
        where: { id: item.selectionId },
        include: { market: true },
      });
      if (!selection || selection.market.status !== MarketStatus.OPEN) {
        throw new BadRequestException(`Market closed for selection ${item.selectionId}`);
      }
      combinedOdds *= Number(selection.odds);
      bets.push({ selection, odds: Number(selection.odds) });
    }

    const potentialReturn = totalStake * combinedOdds;
    await this.wallet.deductForBet(userId, totalStake, slip.id);

    const createdBets = await Promise.all(
      bets.map((b) =>
        this.prisma.bet.create({
          data: {
            userId,
            betSlipId: slip.id,
            selectionId: b.selection.id,
            stake: totalStake,
            odds: b.odds,
            potentialWin: potentialReturn,
            status: BetStatus.ACCEPTED,
          },
        }),
      ),
    );

    await this.prisma.betSlip.update({
      where: { id: slip.id },
      data: { potentialReturn, status: BetStatus.ACCEPTED },
    });

    return { slip, bets: createdBets, combinedOdds, potentialReturn };
  }

  /** Real-time cashout calculation */
  async cashout(userId: string, dto: CashoutDto) {
    const bet = await this.prisma.bet.findFirst({
      where: { id: dto.betId, userId, status: BetStatus.ACCEPTED },
    });
    if (!bet) throw new NotFoundException('Bet not found');

    const cashoutValue = Number(bet.potentialWin) * 0.7; // Simplified cashout formula
    await this.wallet.creditWinnings(userId, cashoutValue, bet.id);

    await this.prisma.bet.update({
      where: { id: bet.id },
      data: { status: BetStatus.CASHED_OUT, cashoutValue, settledAt: new Date() },
    });

    this.ws.emitToUser(userId, WS_EVENTS.BET_RESULT, { betId: bet.id, status: 'CASHED_OUT', amount: cashoutValue });
    return { cashoutValue, status: 'CASHED_OUT' };
  }

  /** Admin: settle bets for a market */
  async settleMarket(marketId: string, winningSelectionId: string) {
    const selections = await this.prisma.selection.findMany({ where: { marketId } });
    await this.prisma.market.update({
      where: { id: marketId },
      data: { status: MarketStatus.SETTLED },
    });

    for (const sel of selections) {
      const isWinner = sel.id === winningSelectionId;
      await this.prisma.selection.update({
        where: { id: sel.id },
        data: { result: isWinner ? 'WON' : 'LOST', isActive: false },
      });

      const bets = await this.prisma.bet.findMany({
        where: { selectionId: sel.id, status: BetStatus.ACCEPTED },
      });

      for (const bet of bets) {
        if (isWinner) {
          await this.wallet.creditWinnings(bet.userId, Number(bet.potentialWin), bet.id);
          await this.prisma.bet.update({
            where: { id: bet.id },
            data: { status: BetStatus.WON, settledAt: new Date() },
          });
          this.ws.emitToUser(bet.userId, WS_EVENTS.BET_RESULT, {
            betId: bet.id,
            status: 'WON',
            amount: Number(bet.potentialWin),
          });
        } else {
          await this.prisma.bet.update({
            where: { id: bet.id },
            data: { status: BetStatus.LOST, settledAt: new Date() },
          });
        }
      }
    }

    return { message: 'Market settled' };
  }

  /** Auto odds adjustment based on betting volume */
  async adjustOdds(selectionId: string, direction: 'up' | 'down') {
    const selection = await this.prisma.selection.findUnique({ where: { id: selectionId } });
    if (!selection) return;

    const factor = direction === 'down' ? 0.95 : 1.05;
    const newOdds = Math.max(1.01, Math.min(50, Number(selection.odds) * factor));

    const updated = await this.prisma.selection.update({
      where: { id: selectionId },
      data: { odds: newOdds },
    });

    this.ws.emitOddsUpdate({
      selectionId,
      marketId: selection.marketId,
      odds: newOdds,
      timestamp: Date.now(),
    });

    return updated;
  }
}
