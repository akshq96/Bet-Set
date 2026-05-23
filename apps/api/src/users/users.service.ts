import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, SubmitKycDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: true,
        kyc: true,
        achievements: { include: { achievement: true } },
        _count: { select: { bets: true, referrals: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, twoFASecret, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, displayName: true, avatar: true, locale: true, theme: true },
    });
  }

  async submitKyc(userId: string, dto: SubmitKycDto) {
    return this.prisma.kyc.upsert({
      where: { userId },
      update: { ...dto, status: 'SUBMITTED', submittedAt: new Date() },
      create: { userId, ...dto, status: 'SUBMITTED', submittedAt: new Date() },
    });
  }

  async getBettingHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [bets, total] = await Promise.all([
      this.prisma.bet.findMany({
        where: { userId },
        include: { selection: { include: { market: { include: { match: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.bet.count({ where: { userId } }),
    ]);
    return { bets, total, page, limit };
  }

  async getLeaderboard() {
    return this.prisma.user.findMany({
      take: 50,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        displayName: true,
        avatar: true,
        wallet: { select: { balance: true } },
      },
    });
  }

  async getSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      select: { id: true, deviceInfo: true, ipAddress: true, createdAt: true, expiresAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
