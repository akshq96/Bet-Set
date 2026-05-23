import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { WalletModule } from '../wallet/wallet.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WalletModule, WebsocketModule],
  controllers: [PredictionsController],
  providers: [PredictionsService],
})
export class PredictionsModule {}
