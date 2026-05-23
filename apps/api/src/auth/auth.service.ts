import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, OtpVerifyDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private generateReferralCode(): string {
    return `SS${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  private async createTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });
    if (existing) throw new ConflictException('User already exists');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        displayName: dto.displayName,
        passwordHash,
        referralCode: this.generateReferralCode(),
        referredById: dto.referralCode
          ? (await this.prisma.user.findUnique({ where: { referralCode: dto.referralCode } }))?.id
          : undefined,
        wallet: { create: {} },
      },
    });

    const tokens = await this.createTokens(user.id, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
    });
    if (!user?.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.createTokens(user.id, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  /** Mock OTP — in production integrate Firebase */
  async sendOtp(phone: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.prisma.otpVerification.create({
      data: {
        phone,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    // In dev, log OTP; in prod send via Firebase/SMS
    console.log(`📱 OTP for ${phone}: ${otp}`);
    return { message: 'OTP sent successfully', expiresIn: 300 };
  }

  async verifyOtp(dto: OtpVerifyDto) {
    const record = await this.prisma.otpVerification.findFirst({
      where: { phone: dto.phone, otp: dto.otp, verified: false },
      orderBy: { createdAt: 'desc' },
    });
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    let user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: dto.phone,
          displayName: `User_${dto.phone.slice(-4)}`,
          referralCode: this.generateReferralCode(),
          isVerified: true,
          wallet: { create: {} },
        },
      });
    }

    const tokens = await this.createTokens(user.id, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshToken(token: string) {
    const session = await this.prisma.session.findUnique({ where: { refreshToken: token } });
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) throw new UnauthorizedException('User not found');

    await this.prisma.session.delete({ where: { id: session.id } });
    return this.createTokens(user.id, user.role);
  }

  async logout(userId: string) {
    await this.prisma.session.deleteMany({ where: { userId } });
    return { message: 'Logged out successfully' };
  }

  private sanitizeUser(user: { passwordHash?: string | null; twoFASecret?: string | null; [key: string]: unknown }) {
    const { passwordHash, twoFASecret, ...safe } = user;
    return safe;
  }
}
