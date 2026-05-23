import { Controller, Get, Put, Body, UseGuards, Req, Query, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto, SubmitKycDto } from './dto/users.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: { user: { sub: string } }) {
    return this.users.getProfile(req.user.sub);
  }

  @Put('profile')
  updateProfile(@Req() req: { user: { sub: string } }, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(req.user.sub, dto);
  }

  @Post('kyc')
  submitKyc(@Req() req: { user: { sub: string } }, @Body() dto: SubmitKycDto) {
    return this.users.submitKyc(req.user.sub, dto);
  }

  @Get('bets')
  bettingHistory(
    @Req() req: { user: { sub: string } },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.users.getBettingHistory(req.user.sub, page, limit);
  }

  @Get('sessions')
  sessions(@Req() req: { user: { sub: string } }) {
    return this.users.getSessions(req.user.sub);
  }
}
