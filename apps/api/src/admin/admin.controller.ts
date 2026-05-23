import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MODERATOR')
@ApiBearerAuth()
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.admin.getDashboardStats();
  }

  @Get('users')
  users(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.admin.getUsers(page, limit);
  }

  @Put('kyc/:id/approve')
  approveKyc(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.admin.approveKyc(id, req.user.sub);
  }

  @Put('kyc/:id/reject')
  rejectKyc(
    @Param('id') id: string,
    @Req() req: { user: { sub: string } },
    @Body('reason') reason: string,
  ) {
    return this.admin.rejectKyc(id, req.user.sub, reason);
  }

  @Put('withdrawals/:id/approve')
  approveWithdrawal(@Param('id') id: string, @Req() req: { user: { sub: string } }) {
    return this.admin.approveWithdrawal(id, req.user.sub);
  }

  @Get('fraud')
  fraudAlerts() {
    return this.admin.getFraudAlerts();
  }

  @Get('analytics/revenue')
  revenue(@Query('days') days?: number) {
    return this.admin.getRevenueChart(days);
  }

  @Post('markets/:marketId/settle')
  settleMarket(
    @Param('marketId') marketId: string,
    @Body('winningSelectionId') winningSelectionId: string,
  ) {
    return this.admin.settleMarket(marketId, winningSelectionId);
  }
}
