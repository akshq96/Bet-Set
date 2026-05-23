import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BettingService } from '../betting/betting.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private betting: BettingService,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalBets,
      pendingWithdrawals,
      pendingKyc,
      fraudAlerts,
      todayDeposits,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.bet.count(),
      this.prisma.withdrawalRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.kyc.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.fraudAlert.count({ where: { isResolved: false } }),
      this.prisma.transaction.aggregate({
        where: {
          type: 'DEPOSIT',
          status: 'COMPLETED',
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalUsers,
      totalBets,
      pendingWithdrawals,
      pendingKyc,
      fraudAlerts,
      todayRevenue: todayDeposits._sum.amount || 0,
    };
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: { wallet: true, kyc: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { users: users.map(({ passwordHash, twoFASecret, ...u }) => u), total, page };
  }

  async approveKyc(kycId: string, adminId: string) {
    return this.prisma.kyc.update({
      where: { id: kycId },
      data: { status: 'APPROVED', reviewedBy: adminId, reviewedAt: new Date() },
    });
  }

  async rejectKyc(kycId: string, adminId: string, reason: string) {
    return this.prisma.kyc.update({
      where: { id: kycId },
      data: {
        status: 'REJECTED',
        reviewedBy: adminId,
        reviewedAt: new Date(),
        rejectionReason: reason,
      },
    });
  }

  async approveWithdrawal(requestId: string, adminId: string) {
    const request = await this.prisma.withdrawalRequest.update({
      where: { id: requestId },
      data: { status: 'COMPLETED', reviewedBy: adminId, reviewedAt: new Date() },
    });

    const wallet = await this.prisma.wallet.findFirst({ where: { userId: request.userId } });
    if (wallet) {
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          lockedBalance: wallet.lockedBalance.sub(Number(request.amount)),
          totalWithdrawn: wallet.totalWithdrawn.add(Number(request.amount)),
        },
      });
    }

    return request;
  }

  async getFraudAlerts() {
    return this.prisma.fraudAlert.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRevenueChart(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: { in: ['DEPOSIT', 'BET_PLACED'] },
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
      select: { amount: true, type: true, createdAt: true },
    });

    const daily: Record<string, { deposits: number; bets: number }> = {};
    for (const tx of transactions) {
      const day = tx.createdAt.toISOString().split('T')[0];
      if (!daily[day]) daily[day] = { deposits: 0, bets: 0 };
      if (tx.type === 'DEPOSIT') daily[day].deposits += Number(tx.amount);
      else daily[day].bets += Math.abs(Number(tx.amount));
    }

    return Object.entries(daily).map(([date, data]) => ({ date, ...data }));
  }

  async settleMarket(marketId: string, winningSelectionId: string) {
    return this.betting.settleMarket(marketId, winningSelectionId);
  }
}
