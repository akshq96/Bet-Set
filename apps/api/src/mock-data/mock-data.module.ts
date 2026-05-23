import { Module } from '@nestjs/common';
import { MockDataService } from './mock-data.service';
import { MockDataController } from './mock-data.controller';
import { WebsocketModule } from '../websocket/websocket.module';
import { BettingModule } from '../betting/betting.module';

@Module({
  imports: [WebsocketModule, BettingModule],
  controllers: [MockDataController],
  providers: [MockDataService],
})
export class MockDataModule {}
