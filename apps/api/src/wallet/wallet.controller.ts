import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DepositDto, WithdrawDto } from './dto/wallet.dto';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private wallet: WalletService) {}

  @Get()
  getWallet(@Req() req: { user: { sub: string } }) {
    return this.wallet.getWallet(req.user.sub);
  }

  @Post('deposit')
  deposit(@Req() req: { user: { sub: string } }, @Body() dto: DepositDto) {
    return this.wallet.deposit(req.user.sub, dto.amount, dto.paymentMethod);
  }

  @Post('withdraw')
  withdraw(@Req() req: { user: { sub: string } }, @Body() dto: WithdrawDto) {
    return this.wallet.withdraw(req.user.sub, dto.amount, dto.upiId);
  }

  @Get('transactions')
  transactions(
    @Req() req: { user: { sub: string } },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.wallet.getTransactions(req.user.sub, page, limit);
  }
}
