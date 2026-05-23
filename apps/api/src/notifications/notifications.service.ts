import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async create(userId: string, title: string, body: string, type: string, data?: object) {
    return this.prisma.notification.create({
      data: { userId, title, body, type, data },
    });
  }

  /** Mock push/SMS — integrate FCM, Twilio in production */
  async sendPush(userId: string, title: string, body: string) {
    await this.create(userId, title, body, 'push');
    console.log(`📲 Push to ${userId}: ${title}`);
    return { sent: true };
  }
}
