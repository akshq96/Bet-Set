import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BettingModule } from '../betting/betting.module';

@Module({
  imports: [BettingModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
