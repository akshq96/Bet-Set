import { Module } from '@nestjs/common';
import { FantasyService } from './fantasy.service';
import { FantasyController } from './fantasy.controller';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [WalletModule],
  controllers: [FantasyController],
  providers: [FantasyService],
  exports: [FantasyService],
})
export class FantasyModule {}
