import { Controller, Get, Put, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  list(@Req() req: { user: { sub: string } }) {
    return this.notifications.getNotifications(req.user.sub);
  }

  @Put(':id/read')
  markRead(@Req() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.notifications.markRead(req.user.sub, id);
  }
}
