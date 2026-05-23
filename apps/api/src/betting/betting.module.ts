import { Module } from '@nestjs/common';
import { BettingService } from './betting.service';
import { BettingController } from './betting.controller';
import { WalletModule } from '../wallet/wallet.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WalletModule, WebsocketModule],
  controllers: [BettingController],
  providers: [BettingService],
  exports: [BettingService],
})
export class BettingModule {}
