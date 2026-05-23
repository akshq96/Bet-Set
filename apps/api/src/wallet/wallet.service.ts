import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  /** Mock deposit — integrates Razorpay in production */
  async deposit(userId: string, amount: number, paymentMethod = 'razorpay') {
    if (amount < 100) throw new BadRequestException('Minimum deposit is ₹100');

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) throw new NotFoundException('Wallet not found');

      const newBalance = wallet.balance.add(amount);
      const updated = await tx.wallet.update({
        where: { userId },
        data: {
          balance: newBalance,
          totalDeposited: wallet.totalDeposited.add(amount),
        },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.COMPLETED,
          amount,
          balanceAfter: newBalance,
          paymentMethod,
          reference: `DEP_${Date.now()}`,
          metadata: { mock: true, gateway: 'razorpay' },
        },
      });

      return updated;
    });
  }

  async withdraw(userId: string, amount: number, upiId?: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.balance.lessThan(amount)) {
      throw new BadRequestException('Insufficient balance');
    }
    if (amount < 500) throw new BadRequestException('Minimum withdrawal is ₹500');

    const request = await this.prisma.withdrawalRequest.create({
      data: { userId, amount, upiId, status: TransactionStatus.PENDING },
    });

    await this.prisma.wallet.update({
      where: { userId },
      data: {
        balance: wallet.balance.sub(amount),
        lockedBalance: wallet.lockedBalance.add(amount),
      },
    });

    return { message: 'Withdrawal request submitted', requestId: request.id };
  }

  async deductForBet(userId: string, amount: number, betId: string) {
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || wallet.balance.lessThan(amount)) {
        throw new BadRequestException('Insufficient balance');
      }

      const newBalance = wallet.balance.sub(amount);
      await tx.wallet.update({
        where: { userId },
        data: { balance: newBalance },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: TransactionType.BET_PLACED,
          status: TransactionStatus.COMPLETED,
          amount: -amount,
          balanceAfter: newBalance,
          reference: betId,
        },
      });

      return newBalance;
    });
  }

  async creditWinnings(userId: string, amount: number, betId: string) {
    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) throw new NotFoundException('Wallet not found');

      const newBalance = wallet.balance.add(amount);
      await tx.wallet.update({ where: { userId }, data: { balance: newBalance } });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: TransactionType.BET_WON,
          status: TransactionStatus.COMPLETED,
          amount,
          balanceAfter: newBalance,
          reference: betId,
        },
      });

      return newBalance;
    });
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where: { walletId: wallet.id } }),
    ]);

    return { transactions, total, page, limit };
  }

  async applyBonus(userId: string, amount: number, reason: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const newBonus = wallet.bonusBalance.add(amount);
    await this.prisma.wallet.update({
      where: { userId },
      data: { bonusBalance: newBonus },
    });

    await this.prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: TransactionType.BONUS,
        status: TransactionStatus.COMPLETED,
        amount,
        balanceAfter: wallet.balance,
        metadata: { reason },
      },
    });
  }
}
