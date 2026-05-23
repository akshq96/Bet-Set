import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, OtpSendDto, OtpVerifyDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register with email/password' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email or phone' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('otp/send')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Send OTP to mobile' })
  sendOtp(@Body() dto: OtpSendDto) {
    return this.auth.sendOtp(dto.phone);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify OTP and login/register' })
  verifyOtp(@Body() dto: OtpVerifyDto) {
    return this.auth.verifyOtp(dto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') token: string) {
    return this.auth.refreshToken(token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  logout(@Req() req: { user: { sub: string } }) {
    return this.auth.logout(req.user.sub);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  me(@Req() req: { user: { sub: string } }) {
    return { userId: req.user.sub };
  }
}
